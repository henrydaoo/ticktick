const Background = () => {
  return (
    <div className="absolute inset-0 text-white bg-[#084FFF]  flex items-center justify-center overflow-hidden pointer-events-none animate-fade-in">
      <div
        className="w-[150%] aspect-square rounded-full bg-[#0648DB] flex items-center justify-center -mt-[29%] lg:-mt-[15%] animate-scale-in"
        style={{ boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.15)" }}
      >
        <div
          className="w-[75%] aspect-square rounded-full bg-[#0442BA] flex items-center justify-center animate-scale-in-delay-1"
          style={{ boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.2)" }}
        >
          <div
            className="aspect-square w-[75%] rounded-full bg-[#023DA1] flex items-center justify-center animate-scale-in-delay-2"
            style={{ boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.25)" }}
          >
            <div
              className="aspect-square w-[70%] rounded-full bg-[#075AD8] flex items-center justify-center animate-scale-in-delay-3"
              style={{ boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.2)" }}
            >
              <div
                className="aspect-square w-[60%] rounded-full bg-[#B5CEF3] flex flex-col items-center justify-center lg:justify-end relative animate-scale-in-delay-4"
                style={{ boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.3)" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Background;
