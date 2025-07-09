import { Button, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import FAQInput from "../../../components/form/FAQInput";
import { useFieldArray, useFormContext } from "react-hook-form";

const FaqSection = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faq",
  });

  const handleAddFaq = () => append({ question: "", answer: "" });

  const handleRemoveFaq = (index: number) => remove(index);

  return (
    <>
      {fields.map((field, index) => (
        <FAQInput
          key={field.id}
          name={`faq[${index}]`}
          questionLabel="Question"
          answerLabel="Answer"
          placeholderQuestion="Enter your question"
          placeholderAnswer="Enter your answer"
          onRemove={handleRemoveFaq}
          index={index}
        />
      ))}
      <Row>
        <Col span={24}>
          <Button
            className="w-full btn_outline"
            onClick={handleAddFaq}
            icon={<PlusOutlined />}
          >
            Add FAQ
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default FaqSection;
