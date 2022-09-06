import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { ShowEventsApi, updateEventApi } from "../Redux/actions";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import {useNavigate} from "react-router-dom"


//schema to validate event inputs 
const schema = yup.object({
  title: yup.string().required("Can't Be Empty"),
  start: yup.date().required("Please specify the time to start"),
  end: yup.date("must be a valid date").required("on update you must specify an end date"),
}).required();

;

const  UpdateEvent = ({updateEventApi,id, event, error,OnshowUpdateModal}) =>  {
  const navigate = useNavigate();
  const [rerender, setRerender] = useState(false);
  const [dbError, setError] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [toogleFull, setToogleFull] = useState(false);

  const [firstRender, setFirstRender] = useState(true);
  const [currentEvent, setCurerntEvent] = useState(
    event || { start: "", end: "" }
  );
  //  const [startDate, setStartDate] = useState(new Date());
  useEffect( ()=>{
    console.log(error);
    if(error && !firstRender){
      setError(error)
      
    }
    if (!error.start && !error.end && dbError !== false) {
        OnshowUpdateModal(false);
      }
     
   }, [rerender,error,navigate])
  //using form-hook to register event data
  const { register, handleSubmit, formState: {errors}, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: event.title,
      start: new Date(event.start) ,
      end: event.end? new Date(event.end) :"",
      describe: event.describe? event.describe : "No description was provided"
    }
  });
   const onSubmit = async(values)=>{
    setFirstRender(false)
    console.log("values",values)
    console.log("event",event)

    updateEventApi(values, id)
    .then(res=> {
      console.log(res);
      setRerender(!rerender);
    })
    
  }


  return ReactDOM.createPortal(
    <div
      id="authentication-modal"
      tabIndex="-1"
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex"
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`relative ${
          !toogleFull ? "p-4 max-w-md h-full md:h-auto" : " w-screen h-screen "
        } `}
      >
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 ">
          <button
            onClick={() => OnshowUpdateModal(false)}
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="authentication-modal"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="py-2 px-6 lg:px-8">
            <div
              onMouseEnter={() => setTooltip(true)}
              onMouseLeave={() => setTooltip(false)}
              onClick={() => setToogleFull(!toogleFull)}
              className="px-1 py-1.5 text-xs  w-[30px] curspor-pointer font-semibold text-gray-800 rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer"
            >
              {!toogleFull ? (
                <svg
                  className="w-5 h-5 hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              ) : (
                <svg
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
              )}
            </div>
            <div
              id="tooltip-animation"
              role="tooltip"
              className={`inline-block absolute  ${
                !tooltip ? "invisible tooltip opacity-0" : ""
              } z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm  transition-opacity duration-300  dark:bg-gray-700`}
            >
              {!toogleFull ? "passer en plein écran" : "passer en mini écran"}

              {/* <div className="tooltip-arrow" data-popper-arrow></div> */}
            </div>
            {/* <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Créer un evénement</h3> */}
            <form onSubmit={handleSubmit(onSubmit)} className=" align-content-center m-5">
    <div className="mb-4">
      <label htmlFor="title" className="form-label">Titre</label>
      <input {...register("title")}   type="text" placeholder="titre" className="form-control" id="title" aria-describedby="title" />
      <p className={`error text-warning position-absolute ${errors.title?"active":""}`}>{errors.title?<i className="bi bi-info-circle me-2"></i>:""}{errors.title?.message}</p>
    </div>
    <div className="mb-4" style={{zIndex: "100"}}>
      <label htmlFor="start" className="form-label">Date de début</label>
      {/* controllers are the way you can wrap and use datePicker inside react form-hook*/}
      {/* start date controller*/}
      <Controller
      control={control}
      name="start"

      render={({ field }) => (
        <DatePicker
          placeholderText="Selectionner la date de débu"
          onChange={(date) => field.onChange(date)}
          selected={field.value}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="MMMM d, yyyy h:mm aa"
          className="form-control"
          id="start"
        />
      )}
    />
    {/* error handling */}
    <p className={`error text-warning position-absolute ${errors.start?"active":""}`}>{errors.start?<i className=" bi bi-info-circle me-2"></i>:""}{errors.start?.message}</p>
    <p className={`error text-warning position-absolute ${dbError.start?"":"d-none"}`}>{dbError.start?<i className=" bi bi-info-circle me-2"></i>:""}{dbError.start}</p>
    </div>
    <div className="mb-4" style={{zIndex: "100"}}>
      <label htmlFor="end" className="form-label">Date de fin</label>
      {/* end date controller*/}
      {/* end date controller*/}
      <Controller
    control={control}
    name="end"
    render={({ field }) => (
      <DatePicker
        placeholderText="Select la date de fin"
        onChange={(date) => field.onChange(date)}
        selected={field.value}
        timeFormat="HH:mm"
        dateFormat="MMMM d, yyyy h:mm aa"
        showTimeSelect
        className="form-control"
        id="end"
        
      />
    )}
  />
  {/* error handling */}
  <p className={`error text-warning position-absolute ${errors.end?"active":""}`}>{errors.end?<i className=" bi bi-info-circle me-2"></i>:""}{errors.end?.message}</p>
  <p className={`error text-warning position-absolute ${dbError.end?"":"d-none"}`}>{dbError.end?<i className=" bi bi-info-circle me-2"></i>:""}{dbError.end}</p>

    </div>
    <div className="mb-4">
      <label htmlFor="describe" className="form-label">
       Description <span className="text-danger small">(optional)</span>
      </label>
      <input {...register("describe")}   type="text" placeholder="décrivez votre événement" className="form-control" id="describe" aria-describedby="describe" />
    </div>
    <button type="submit" className="btn btn-warning">Mise a jour</button>
  </form>
          </div>
        </div>
      </div>
    </div>,

    document.querySelector("#modal")
  );
};

function mapStateToProps({ event, error }) {
  return {
    error,
    event
  };
}
export default connect(mapStateToProps , {updateEventApi, ShowEventsApi})(UpdateEvent)