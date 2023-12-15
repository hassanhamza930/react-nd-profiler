;
import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  setFilter: (args: string) => void;
}
const Dropdown: React.FC<Props> = ({ setFilter }) => {
  const [selected, setSelected] = useState("child");

  const options = ["child", "employee"];

  useEffect(() => {
    setFilter(selected);
  }, [selected]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="relative w-[170px] pe-2 text-right text-sm md:text-lg font-medium text-black">
              <span className="flex items-center justify-end">
                <span className="ml-3 block truncate capitalize">
                  {selected}
                </span>
                <BiChevronDown
                  className="-mr-1 w-7 text-md text-black"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white shadow-md focus:outline-none">
                {options.map((option) => (
                  <Listbox.Option
                    key={option}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-gray-100 " : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9 text-sm"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "ml-3 block truncate text-left text-md capitalize"
                          )}
                        >
                          {option}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active
                                ? "text-white"
                                : "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          ></span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default Dropdown;
