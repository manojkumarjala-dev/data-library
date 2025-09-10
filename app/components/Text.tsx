import { FunctionComponent, ReactNode } from "react";

interface TextProps {
  heading: string;
  content: string | ReactNode;
  headingClassName?: string; 
  contentClassName?: string; 
  wrapperClassName?: string; 
}

const Text: FunctionComponent<TextProps> = ({
  heading,
  content,
  headingClassName = "w-full tracking-[0.01em] text-4xl font-bold text-blue-600",
  contentClassName = "w-full text-base tracking-[0.01em] leading-6 font-medium text-black",
  wrapperClassName = "w-full relative flex justify-start px-15 text-left font-inter bg-white",
}) => {
  return (
    <div className={wrapperClassName}>
      <div className="flex flex-col items-start gap-5 w-full ">
        <b className={headingClassName}>{heading}</b>
        <div className={contentClassName}>{content}</div>
      </div>
    </div>
  );
};

export default Text;
