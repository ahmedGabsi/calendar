import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Route, Routes, Link } from "react-router-dom";
import MyCalendar from "./Calendar";
import "../style/global.scss";
import AddEvents from "./AddEvents";
import UpdateEvent from "./UpdateEvent";
import Modal from "./Modal";
import { Controller, useForm } from "react-hook-form";
import ReactDatePicker from "react-datepicker";
const valuesSelect = ["Agenda actifs", "Tous les agendas"];
function App() {
  const [showModal, setShowModal] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [input, setInput] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [darkMode,setDarkMode] = useState((localStorage.getItem("mode")==="true") || false);
  const [tooltip, setTooltip] = useState(false);

  const refSearch = useRef(null);
  const refchild = useRef(null);
  const [formSearch, setFormSearch] = useState({
search:"",
startDate:"",
endDate:"",
participants :"",
where:"",
object:""

  });



  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    const clickOutsideSearch = (e) => {
      if (
        refSearch.current &&
        !refSearch.current.contains(e.target) &&
        refchild.current &&
        !refchild.current.contains(e.target)
      ) {
        setDropDown(false);
      }
    };
    document.addEventListener("mousedown", clickOutsideSearch);

    return () => {
      document.removeEventListener("mousedown", clickOutsideSearch);
    };
  }, [refSearch]);
  const onChangeMode=()=>{
    localStorage.setItem("mode",!darkMode)
    setDarkMode(!darkMode)
  }
const onChangeHandle=(e)=>{
  setFormSearch((prev)=>({...prev,[e.target.name]:e.target.value}))
}
console.log(formSearch)
  return (
    <div className={`${darkMode ? "bg-black":"bg-white"} h-screen`}>
      {!fullscreen && (
        <nav className={`${darkMode ? "bg-black":"bg-white"} border-b`}>
          <div className="flex p-2 justify-between items-center ">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="toggle"
                className="inline-flex relative items-center  cursor-pointer"
              >
                <input
                  type="checkbox"
                  defaultValue=""
                  id="toggle"
                  className="sr-only peer"
                  onClick={onChangeMode}
                  defaultChecked={darkMode}
                />
                <div className="w-14 h-7 bg-gray-800 rounded-full peer  dark:peer-focus:ring-black dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-gray-400" />
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
              </label>

              <div
                className="px-1 relative py-1.5 text-xs  w-[30px] curspor-pointer font-semibold bg-white text-gray-800 rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={() => setFullscreen(true)}
                onMouseEnter={() => setTooltip(true)}
              onMouseLeave={() => setTooltip(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
                <div
              id="tooltip-animation"
              role="tooltip"
              className={`inline-block absolute  ${
                !tooltip ? "invisible tooltip opacity-0" : ""
              } z-10 py-2 left-0 top-full px-3 w-[170px] text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm  transition-opacity duration-300  dark:bg-gray-700`}
            >
          passer en plein écran

              {/* <div className="tooltip-arrow" data-popper-arrow></div> */}
            </div>
              </div>
            </div>
            {input && (
              <form className="w-full mx-10 relative">
                <div className="flex shadow-md rounded-sm">
                  <div className="flex justify-center items-center bg-gray-50 pl-2 pr-7 ">
                    <svg
                      aria-hidden="true"
                      className="ml-1 w-7 h-7 cursor-pointer"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => setDropDown(!dropDown)}
                      ref={refSearch}
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div
                    id="dropdown"
                    className={`${
                      dropDown ? "block" : "hidden"
                    } z-10 w-full absolute top-full bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700`}
                    data-popper-reference-hidden=""
                    data-popper-escaped=""
                    data-popper-placement="top"
                    ref={refchild}

                    // style={{
                    //   position: "absolute",
                    //   inset: "auto auto 0px 0px",
                    //   margin: "0px",
                    //   transform: "translate3d(897px, 5637px, 0px)",
                    // }}
                  >
                    <ul
                      className="py-1 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdown-button"
                    >
                      <li className="inline-flex items-center  py-2 px-4 w-full ">
                        <span className="w-[128px]">Rechercher dans </span>
                        {/* <button
                          type="button"
                          className="inline-flex py-2 px-4 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Mockups
                        </button> */}
                        <select className="bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300 p-2 rounded-sm ">
                          {valuesSelect.map((value) => (
                            <option key={value} value={value}>{value}</option>
                          ))}
                        </select>
                      </li>
                      <li className="inline-flex items-center  py-2 px-4 w-full ">
                        <span className="w-[128px]">Objet </span>

                        <input
                          type="text"
                          name="object"
                          id="object"
                          onChange={onChangeHandle}
                          className="block p-2  w-3/4  focus:outline-none focus:ring focus:border-blue-500  text-gray-900 bg-gray-50 rounded-sm border border-gray-300 sm:text-xs focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </li>
                      <li className="inline-flex items-center  py-2 px-4 w-full ">
                        <span className="w-[128px]">Où ? </span>

                        <input
                          type="text"
                          onChange={onChangeHandle}
                          name="where"
                          id="where"
                          className="block p-2  w-3/4   focus:outline-none focus:ring  text-gray-900 bg-gray-50 rounded-sm border border-gray-300 sm:text-xs focus:ring-blue-300 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </li>
                      <li className="inline-flex items-center  py-2 px-4 w-full ">
                        <span className="w-[128px]">Participants </span>

                        <input
                          type="text"
                          id="participants"
                          name="participants"
                          className="block p-2  w-3/4  focus:outline-none focus:ring text-gray-900 bg-gray-50 rounded-sm border border-gray-300 sm:text-xs focus:ring-blue-300 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        
                          onChange={onChangeHandle}

                        />
                      </li>
                      <li className="inline-flex items-center  py-2 px-4 w-full ">
                        <span className="w-[128px]">Date </span>
                        <div className="space-x-1 flex items-center">
                          <ReactDatePicker
                            placeholderText="Du"
                            name="startDate"
                            // onChange={(date) => field.onChange(date)}
                            // selected={state?.event?.start||field.value}
                            // value={state?.event?.start||field.value}
                            // selected={field.value}
                            // value={field.value}
                            selected={formSearch.startDate}
                            dateFormat="MMMM d, yyyy"
                            onChange={(startDate) => setFormSearch((prev)=>({...prev,startDate}))}
                            value={formSearch.startDate}
                            className="form-control"
                          />
                          <span className="text-lg text-bold">-</span>
                          <ReactDatePicker
                            placeholderText="Au"
                            name="endDate"

                            // onChange={(date) => field.onChange(date)}
                            // selected={state?.event?.start||field.value}
                            // value={state?.event?.start||field.value}
                            // selected={field.value}
                            // value={field.value}

                            selected={formSearch.endDate}
                            dateFormat="MMMM d, yyyy"
                            onChange={(endDate) => setFormSearch((prev)=>({...prev,endDate}))}
                            value={formSearch.endDate}
                            className="form-control"
                            id="start"
                          />
                        </div>
                      </li>
                    </ul>
                    <div className="flex justify-end space-x-2 p-2">
                      <button
                        type="button"
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-2 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      >
                        Réintialiser
                      </button>

                      <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm p-2 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        Rechercher
                      </button>
                    </div>
                  </div>
                  <div className="relative w-full">
                    <input
                      type="search"
                      id="search-dropdown"
                      className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg  border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 outline-none"
                      placeholder="Rechercher"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute top-0 right-0 p-[9px] text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                      <span className="sr-only">Search</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
            <div className="flex space-x-1 items-center cursor-pointer">
              <div
                className={`${darkMode ? "hover:bg-gray-800":" hover:bg-gray-100"  } p-2   hover:rounded-full`}
                onClick={() => setInput(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`${darkMode ? "text-white ":""  } w-5 h-5  `}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
             

              </div>
              <button
  type="button"
  className="text-gray-900 bg-gray-100 text-lg hover:bg-gray-200 focus:outline-none focus:bg-gray-300 bg:text-gray-900 font-medium rounded-full shadow-md  px-3 p-1.5 text-center inline-flex items-center dark:focus:ring-gray-500 "
  onClick={() => setShowModal(true)}

><svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 mr-3 -ml-2 text-[#626890]"

                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
  
                Créer
</button>

              

            </div>
          </div>
        </nav>
      )}
      <Routes>
        <Route
          path="/"
          exact
          element={
            <MyCalendar
              showModal={showModal}
              setFullscreen={setFullscreen}
              setShowModal={setShowModal}
              fullscreen={fullscreen}
              darkMode={darkMode}
              
            />
          }
        />
        {/* <Route path="/events/add" element={<Modal/>}/>
      <Route path="/event/:id/update" element={<UpdateEvent/>}/> */}
      </Routes>
    </div>
  );
}

export default App;
