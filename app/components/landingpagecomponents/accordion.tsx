interface FAQ {
  question: string;
  answer: string;
}

interface AccordionProps {
  faq: FAQ;
  isOpen: boolean;
  onClick: () => void;
}

const Accordion = ({ faq, isOpen, onClick }: AccordionProps) => {
  return (
    <div className="border-b-2">
      <button
        className="w-full text-left py-4 flex justify-between items-center focus:outline-none"
        onClick={onClick}
      >
        <span className="text-xl font-semibold">{faq.question}</span>
        <span>{isOpen ? "-" : "+"}</span>
      </button>
      <div
        className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <p className="py-4">{faq.answer}</p>
      </div>
    </div>
  );
};

export default Accordion;
