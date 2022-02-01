const MainButton = ({ text, action }) => {
  return (
    <div
      onClick={action}
      className="bg-dark hover:bg-white flex justify-center px-10
                  py-3 rounded drop-shadow-lg cursor-pointer text-white hover:text-dark border-dark border-4"
    >
      <span className="font-sans font-bold">{text}</span>
    </div>
  );
};

export default MainButton