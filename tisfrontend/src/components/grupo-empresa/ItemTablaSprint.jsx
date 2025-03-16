/* eslint-disable react/prop-types */

const ItemTablaSprint = ({ nombre_sprint }) => {
  return (
    <div className="flex cursor-pointer select-none justify-between rounded-md bg-neutral-200 px-4 py-2 font-semibold text-primary-800">
      <p> Hu {nombre_sprint}</p>
    </div>
  );
};

export default ItemTablaSprint;
