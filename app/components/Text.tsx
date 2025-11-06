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
  wrapperClassName = "w-full relative flex flex-col justify-start px-[var(--Utilities-Spacing-20,80px)] py-[var(--Utilities-Spacing-15,60px)] gap-[var(--Utilities-Spacing-5,20px)] text-left font-inter bg-white",
}) => {
  return (
    <div className={wrapperClassName}>
        <b className={headingClassName}>{heading}</b>
        <div className={contentClassName}>{content}</div>
    </div>
  );
};

export default Text;
