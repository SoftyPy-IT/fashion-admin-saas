import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, message, Skeleton } from "antd";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { BsGripVertical } from "react-icons/bs";
import {
  useGetCategoryTreeQuery,
  useUpdateMegaMenuOrderMutation,
} from "../../../redux/features/product/category.api";

type SubCategory = {
  _id: string;
  name: string;
  serial: number;
  type: "subcategory";
  isExpanded: boolean;
  parentCategory: string;
  subCategory: any;
};

type Category = {
  _id: string;
  name: string;
  serial: number;
  type: "category";
  isExpanded: boolean;
  mainCategory: string;
  subCategories: SubCategory[];
  category: any;
};

type MainCategory = {
  _id: string;
  name: string;
  serial: number;
  image: string;
  type: "main";
  isExpanded: boolean;
  categories: Category[];
};

type MenuItem = MainCategory | Category | SubCategory;

const SortableItem = ({
  item,
  depth = 0,
  onToggle,
  parentId,
}: {
  item: MenuItem;
  depth?: number;
  onToggle?: (id: string) => void;
  parentId?: string;
}) => {
  const uniqueId = parentId ? `${item._id}-${parentId}` : item._id;

  // Only make categories and subcategories sortable
  const isSortable = item.type !== "main";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: uniqueId,
    disabled: !isSortable, // Disable sortable for main categories
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasChildren =
    (item.type === "main" && item.categories?.length > 0) ||
    (item.type === "category" && item.subCategories?.length > 0);

  const getTypeColor = () => {
    switch (item.type) {
      case "main":
        return "bg-blue-500 text-white";
      case "category":
        return "bg-green-500 text-white";
      case "subcategory":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getBorderColor = () => {
    switch (item.type) {
      case "main":
        return "border-blue-300";
      case "category":
        return "border-green-300";
      case "subcategory":
        return "border-orange-300";
      default:
        return "border-gray-300";
    }
  };

  const getBackgroundColor = () => {
    if (isDragging) return "bg-gray-100";

    switch (item.type) {
      case "main":
        return "bg-blue-50";
      case "category":
        return "bg-green-50";
      case "subcategory":
        return "bg-orange-50";
      default:
        return "bg-white";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-2 transition-all duration-200 ${getBackgroundColor()} border-l-4 ${getBorderColor()} rounded-md shadow-sm`}
    >
      <div className="flex items-center p-3">
        {isSortable ? (
          <div {...attributes} {...listeners} className="mr-3 cursor-grab">
            <BsGripVertical className="w-5 h-5 text-gray-400" />
          </div>
        ) : (
          <div className="mr-3 opacity-50 cursor-not-allowed">
            <BsGripVertical className="w-5 h-5 text-gray-400" />
          </div>
        )}

        <div className="flex items-center flex-grow">
          {hasChildren && (
            <button
              onClick={() => onToggle?.(uniqueId)}
              className="p-1 mr-2 transition-colors duration-200 rounded-full hover:bg-gray-200"
            >
              {item.isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          )}

          {!hasChildren && <div className="mr-2 w-7"></div>}

          {item.type === "main" && item.image && (
            <Avatar
              src={item.image}
              alt={item.name}
              className="mr-3 border border-gray-300"
            />
          )}

          <div className="font-medium">{item.name}</div>
        </div>

        <div className="flex items-center">
          <span
            className={`px-2 py-1 text-xs rounded-full mr-3 ${getTypeColor()}`}
          >
            {item.type}
          </span>

          <span className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-full">
            Order: {item.serial}
          </span>

          {hasChildren && (
            <span className="px-2 py-1 ml-3 text-xs text-gray-700 bg-gray-200 rounded-full">
              {item.type === "main"
                ? item.categories?.length
                : item.subCategories?.length}{" "}
              children
            </span>
          )}
        </div>
      </div>

      {item.isExpanded && (
        <div className="pb-3 pl-10 pr-3">
          {item.type === "main" && item.categories?.length > 0 && (
            <div className="pl-4 border-l-2 border-blue-300">
              {item.categories.map((category: Category) => (
                <SortableItem
                  key={`${category._id}-${item._id}`}
                  item={category}
                  depth={depth + 1}
                  onToggle={onToggle}
                  parentId={item._id}
                />
              ))}
            </div>
          )}

          {item.type === "category" && item.subCategories?.length > 0 && (
            <div className="pl-4 border-l-2 border-green-300">
              {item.subCategories.map((subCategory: SubCategory) => (
                <SortableItem
                  key={`${subCategory._id}-${item._id}`}
                  item={subCategory}
                  depth={depth + 1}
                  onToggle={onToggle}
                  parentId={item._id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MegaMenuTree = () => {
  const [menuItems, setMenuItems] = useState<MainCategory[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: mainCategoriesData, isLoading: loadingMain } =
    useGetCategoryTreeQuery([]);

  const [updateOrder, { isLoading: isUpdatingOrder }] =
    useUpdateMegaMenuOrderMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    if (mainCategoriesData?.data) {
      const processedData = mainCategoriesData.data.map(
        (mainCat: any): MainCategory => ({
          ...mainCat,
          type: "main",
          isExpanded: expandedIds.has(mainCat._id),
          categories: mainCat.categories
            ?.map((cat: any) => cat.category)
            .filter(Boolean)
            .map(
              (category: any, index: number): Category => ({
                ...category,
                type: "category",
                serial: index + 1,
                mainCategory: mainCat._id,
                isExpanded: expandedIds.has(`${category._id}-${mainCat._id}`),
                subCategories: category.subCategories
                  ?.map((sub: any) => sub.subCategory)
                  .filter(Boolean)
                  .map(
                    (subCategory: any, subIndex: number): SubCategory => ({
                      ...subCategory,
                      type: "subcategory",
                      serial: subIndex + 1,
                      parentCategory: category._id,
                      isExpanded: false,
                    }),
                  ),
              }),
            ),
        }),
      );
      setMenuItems(processedData);
    }
  }, [mainCategoriesData, expandedIds]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const findItemById = (
    items: MenuItem[],
    id: string,
    parentId?: string,
  ): {
    item: MenuItem | null;
    path: number[];
    parentId?: string;
  } => {
    const [itemId, parentIdFromComposite] = id.split("-");

    for (let i = 0; i < items.length; i++) {
      const currentItem = items[i];
      const currentItemId = currentItem._id;
      const currentCompositeId = parentId
        ? `${currentItemId}-${parentId}`
        : currentItemId;

      if (
        currentCompositeId === id ||
        (itemId === currentItemId && parentIdFromComposite === parentId)
      ) {
        return { item: currentItem, path: [i], parentId };
      }

      if (currentItem.type === "main") {
        const mainCat = currentItem as MainCategory;
        if (mainCat.categories) {
          const categoryResult = findItemById(
            mainCat.categories,
            id,
            mainCat._id,
          );
          if (categoryResult.item) {
            return {
              ...categoryResult,
              path: [i, ...categoryResult.path],
            };
          }

          for (let j = 0; j < mainCat.categories.length; j++) {
            const category = mainCat.categories[j];
            if (category.subCategories) {
              const subCategoryResult = findItemById(
                category.subCategories,
                id,
                category._id,
              );
              if (subCategoryResult.item) {
                return {
                  ...subCategoryResult,
                  path: [i, j, ...subCategoryResult.path],
                };
              }
            }
          }
        }
      }
    }
    return { item: null, path: [] };
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const { item } = findItemById(menuItems, active.id);

    // Prevent dragging of main categories
    if (item && item.type === "main") {
      event.preventDefault();
      return;
    }

    setActiveId(active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const newItems = JSON.parse(JSON.stringify(menuItems));

    const { item: activeItem, path: activePath } = findItemById(
      newItems,
      active.id,
    );
    const { item: overItem, path: overPath } = findItemById(newItems, over.id);

    if (!activeItem || !overItem) return;

    // Skip if trying to drag a main category
    if (activeItem.type === "main") {
      message.info("Main categories cannot be reordered");
      return;
    }

    const isValidDrag = (activeType: string, overType: string): boolean => {
      // Main categories can't be dragged
      if (activeType === "main") return false;

      // Categories can only be dragged within their level (among other categories)
      if (activeType === "category" && overType === "category") return true;

      // Subcategories can only be dragged within their level (among other subcategories)
      if (activeType === "subcategory" && overType === "subcategory")
        return true;

      return false;
    };

    if (!isValidDrag(activeItem.type, overItem.type)) {
      message.error(
        "Invalid drag operation. Categories and subcategories can only be reordered within their level.",
      );
      return;
    }

    // Remove item from its current position
    let current = newItems;
    let parentItem = null;
    for (let i = 0; i < activePath.length - 1; i++) {
      parentItem = current[activePath[i]];
      if (parentItem.type === "main") {
        current = parentItem.categories;
      } else if (parentItem.type === "category") {
        current = parentItem.subCategories;
      }
    }
    const [draggedItem] = current.splice(activePath[activePath.length - 1], 1);

    // Insert item at new position
    current = newItems;
    for (let i = 0; i < overPath.length - 1; i++) {
      current =
        current[overPath[i]].categories || current[overPath[i]].subCategories;
    }
    current.splice(overPath[overPath.length - 1], 0, draggedItem);

    // Update serial numbers and parent references
    newItems.forEach((mainCategory: MainCategory, mainIndex: number) => {
      mainCategory.serial = mainIndex + 1;
      if (mainCategory.categories) {
        mainCategory.categories.forEach(
          (category: Category, categoryIndex: number) => {
            category.serial = categoryIndex + 1;
            category.mainCategory = mainCategory._id;
            if (category.subCategories) {
              category.subCategories.forEach(
                (subCategory: SubCategory, subIndex: number) => {
                  subCategory.serial = subIndex + 1;
                  subCategory.parentCategory = category._id;
                },
              );
            }
          },
        );
      }
    });

    setMenuItems(newItems);

    try {
      // Find the affected main category
      const affectedMainCategory = newItems.find((main: MainCategory) => {
        if (activeItem.type === "category")
          return main.categories.some((cat) => cat._id === activeItem._id);
        if (activeItem.type === "subcategory") {
          return main.categories.some((cat) =>
            cat.subCategories?.some((sub) => sub._id === activeItem._id),
          );
        }
        return false;
      });

      if (!affectedMainCategory) {
        throw new Error("Could not find the modified main category");
      }

      // Format update data
      const updateData = {
        mainCategoryId: affectedMainCategory._id,
        categories: affectedMainCategory.categories.map(
          (category: {
            _id: string;
            serial: number;
            subCategories: SubCategory[];
          }) => ({
            categoryId: category._id,
            serial: category.serial,
            subCategories: (category.subCategories || []).map(
              (subCategory) => ({
                subCategoryId: subCategory._id,
                serial: subCategory.serial,
              }),
            ),
          }),
        ),
      };

      await updateOrder(updateData).unwrap();
      message.success("Menu structure updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      message.error("Failed to update menu structure");
    }
  };

  if (loadingMain) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
          <p className="text-gray-500">Loading menu structure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <div className="bg-white border border-gray-100 shadow-lg rounded-xl">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Mega Menu Builder
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Drag and drop items to reorder categories and subcategories. Main
            categories cannot be reordered. Click the arrows to expand/collapse
            categories.
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center p-2 border-l-4 border-blue-300 rounded-md bg-blue-50">
              <span className="px-2 py-1 mr-2 text-xs text-white bg-blue-500 rounded-full">
                main
              </span>
              <span className="text-sm">Main Category (not draggable)</span>
            </div>
            <div className="flex items-center p-2 border-l-4 border-green-300 rounded-md bg-green-50">
              <span className="px-2 py-1 mr-2 text-xs text-white bg-green-500 rounded-full">
                category
              </span>
              <span className="text-sm">Category (draggable)</span>
            </div>
            <div className="flex items-center p-2 border-l-4 border-orange-300 rounded-md bg-orange-50">
              <span className="px-2 py-1 mr-2 text-xs text-white bg-orange-500 rounded-full">
                subcategory
              </span>
              <span className="text-sm">Subcategory (draggable)</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="p-4 space-y-4 rounded-lg bg-gray-50">
              <SortableContext
                items={menuItems.map((item) => item._id)}
                strategy={verticalListSortingStrategy}
              >
                {isUpdatingOrder ? (
                  <Skeleton active className="p-4 bg-white rounded-lg" />
                ) : (
                  menuItems.map((item) => (
                    <SortableItem
                      key={item._id}
                      item={item}
                      onToggle={toggleExpand}
                    />
                  ))
                )}
              </SortableContext>
            </div>

            <DragOverlay>
              {activeId ? (
                <div className="p-4 border border-blue-200 rounded-lg shadow-lg bg-blue-50">
                  <div className="flex items-center space-x-2">
                    <BsGripVertical className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-blue-700">
                      {findItemById(menuItems, activeId).item?.name}
                    </span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <div className="p-3 mt-6 text-sm text-blue-700 border border-blue-200 rounded-md bg-blue-50">
            <strong>Tip:</strong> Items are displayed with a nested structure.
            Child items appear below and are indented with a colored line
            connecting them to their parent. Only categories and subcategories
            can be reordered.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuTree;
