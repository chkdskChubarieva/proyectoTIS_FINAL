/* eslint-disable react/prop-types */
const ItemBacklog = ({ id_hu, nombre_hu, num_sprint }) => {
  return (
    <div className="flex cursor-pointer select-none justify-between rounded-md bg-neutral-200 px-4 py-2 text-primary-800">
      <section className="flex gap-4">
        <span className="font-semibold">#{id_hu}</span>
        <p>{nombre_hu}</p>
      </section>

      <span className="font-semibold">SP {num_sprint}</span>
    </div>
  );
};

export default ItemBacklog;
