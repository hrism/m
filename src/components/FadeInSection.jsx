import { useEffect, useRef } from "react";

export default function FadeInSection({ id, className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items = ref.current.querySelectorAll(".fade-item");

          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("fade-in");
            }, index * 800); // 順番にフェードイン
          });

          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} id={id} className={`fade-container ${className}`}>
      {children}
    </div>
  );
}
