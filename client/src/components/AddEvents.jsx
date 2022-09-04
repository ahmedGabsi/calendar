import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { addEventApi } from "../Redux/actions";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import { set } from "date-fns";
import moment from "moment"
//schema to validate event inputs 
const schema = yup.object({
  title: yup.string().required("Ne peut pas être vide"),
  start: yup.date().required("Veuillez préciser l'heure de début"),
}).required();



const Modal = ({addEventApi, error}) => {
  const {state} = useLocation();
     const navigate = useNavigate()
     const [rerender, setRerender] = useState(false);
     const [dbError, setError] = useState(false)
     const [firstRender, setFirstRender] = useState(true)
     const [currentEvent,setCurerntEvent]=useState(state?.event || {start:"",end:""})
     
    //  const [startDate, setStartDate] = useState(new Date());



     useEffect( ()=>{
      if(error && !firstRender){
        setError(error)
        
      }
        if(!error.start && !error.end && dbError !== false){
          setTimeout(navigate("/")) 
        }
     }, [rerender,error,navigate])
    //using form-hook to register event data
    const { register, handleSubmit, formState: {errors}, control } = useForm({
    });

    
  //   useEffect(() => {
  //     if (currentEvent) {
  //         // setDefaultValues(
  //         //     { ...defaultValues,start: state.event.start,end:state.event.end }, 
              
  //         // );
  //         setStartDate(currentEvent.start)
  //     }
  // }, [currentEvent.start]);
     const onSubmit = async(values)=>{
      setFirstRender(false)
        addEventApi(values)
        .then(()=>{
        setRerender(!rerender)
    
        })
      
       }


  return (
    //this form is in bootstrab
    <form onSubmit={handleSubmit(onSubmit)} className=" align-content-center m-5">
    <div className="mb-4">
      <label htmlFor="title" className="form-label">Titre</label>
      <input {...register("title")}  type="text" placeholder="Titre" className="form-control" id="title" aria-describedby="title" />
      <p className={`error text-warning position-absolute ${errors.title?"active":""}`}>{errors.title?<i className="bi bi-info-circle me-2"></i>:""}{errors.title?.message}</p>
    </div>
    <div className="mb-4" style={{zIndex: "100"}}>
      <label htmlFor="start" className="form-label">Date de début</label>
      {/* controllers are the way you can wrap and use datePicker inside react form-hook*/}
      {/* start date controller*/}
      <Controller
      control={control}
      name="start"
      defaultValue={currentEvent.start ||new Date() }

      render={({ field }) => (
        <DatePicker
          placeholderText="Selectionner la date de début"
          onChange={(date) => field.onChange(date)}
          // selected={state?.event?.start||field.value}
          // value={state?.event?.start||field.value}
          selected={field.value}
          value={field.value}
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
      <Controller
    control={control}
    name="end"
    defaultValue={currentEvent.end || new Date().setDate(new Date().getDate()+1)}

    render={({ field }) => (
      <DatePicker
        placeholderText="Selectionner la date de fin"
        onChange={(date) => field.onChange(date)}
        selected={field.value}
          value={field.value}
        timeFormat="HH:mm"
        dateFormat="MMMM d, yyyy h:mm aa"
        showTimeSelect
        className="form-control"
        id="end"
        
      />
    )}
  />
    <p className={`error text-warning position-absolute ${dbError.end?"":"d-none"}`}>{dbError.end?<i className=" bi bi-info-circle me-2"></i>:""}{dbError.end}</p>
    </div>
    <div className="mb-4">
      <label htmlFor="describe" className="form-label">
        Description <span className="text-danger small">(optionel)</span>
      </label>
      <input {...register("describe")}  type="text" placeholder="décrivez votre événement" className="form-control" id="describe" aria-describedby="describe" />
    </div>
    <button type="submit" className="btn btn-success">Créer</button>
  </form>
  )
}


function mapStateToProps({event, error}){
  return{
    error
    // event
  }
}


export default connect(mapStateToProps , {addEventApi})(Modal)