interface TooltipProps {
  infoText: string;
  classNameButton?: string;
  classNameInfoBox?: string;
}

/**
 * Tooltip
 *
 * @param {string} infoText - text info to have in the tooltip.
 * @param {string} classNameButton - additional classes to be added to the tooltip button.
 * @param {string} classNameInfoBox - additional classes to be added to the tooltip info box.
 */
const Tooltip = ({ infoText, classNameButton = "", classNameInfoBox = ""}: TooltipProps) => {
  return (
    <button
      type="button"
      className={`tooltip-button absolute p-0 m-0 text-xs text-center font-bold text-black bg-muted-foreground h-[1.5em] aspect-square rounded-[50%] ${classNameButton}`}
    >
      <div
        role="tooltip"
        className={`absolute hidden opacity-0 z-10 -translate-x-[60%] lg:-translate-x-[50%] -translate-y-[125%] w-[30ch] px-3 py-2 text-sm lg:text-xs text-start font-normal text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm tooltip ${classNameInfoBox}`}
      >
        {infoText}
      </div>
      <div>i</div>
    </button>
  );
};

export default Tooltip;
