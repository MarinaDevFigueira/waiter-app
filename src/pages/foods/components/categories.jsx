import React from "react";

function Category({ icon, title }) {
  return (
    <li className="flex justify-between  items-center gap-4 mt-5 ">
      <div className=" flex justify-center items-center flex-col">
        <a className="bg-white  w-10 h-10 shadow-gray-400 shadow-xs rounded-4xl text-center flex items-center justify-center">
          {icon}
        </a>
        <span className="font-semibold text-sm pt-1.5">{title}</span>
      </div>
    </li>
  );
}

const Categories = ({ lista = [] }) => {
  return (
    <ul className="w-72 flex flex-row justify-between items-center ">
      {lista?.map((item) => {
        return <Category icon={item.icon} title={item.title} />;
      })}
    </ul>
  );
};

export default Categories;
