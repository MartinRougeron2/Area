import React from 'react'

const InputSimple = ({name, value, onChange}) => {
  return (
    <div className='flex flex-col'>
      <h5 className='text-black text-sm'>{name}</h5>
      <input value={value} onChange={evt => onChange(evt.target.value)}className='outline-none drop-shadow-md h-14 p-4 text-sm border-2 border-white rounded-md focus:border-light'/>
    </div>
  );
}

export default InputSimple;