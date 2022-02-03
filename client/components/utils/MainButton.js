import React from 'react'

const MainButton = ({ text, action, color = "dark"}) => {
  const [styling, setStyling] = React.useState(null)

  React.useEffect(() => {
    setStyling(`bg-${color} hover:bg-white flex justify-center px-10
    py-3 rounded drop-shadow-lg cursor-pointer text-white hover:text-${color} border-${color} border-4`)
  }, [color])
  return (
    <div
      onClick={action}
      className={styling}
    >
      <span className="font-sans font-bold">{text}</span>
    </div>
  );
};


export default MainButton