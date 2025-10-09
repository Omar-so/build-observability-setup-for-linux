import { useInView } from "react-intersection-observer";
import React from "react";

type InfinityScrollContainerProps = {
  children: React.ReactNode;
  onBottomReached: () => void;
  className?: string;
};

export default function InfinityScrollContainer({
  children,
  onBottomReached,
  className,
}: InfinityScrollContainerProps) {
  const { ref } = useInView({
    rootMargin: "50px",
    onChange: (inView) => { 
        if (inView) {
            onBottomReached();
        }
    }
  });


  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}
