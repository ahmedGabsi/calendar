import React, { useState,useEffect, useLayoutEffect } from "react";
import ReactDOM from "react-dom";

import { connect } from "react-redux";
import {Link} from "react-router-dom"
import { deleteEventApi, ShowEventsApi, closeEvent } from "../Redux/actions";
import { useNavigate } from "react-router-dom";

const Popping = ({ handleClose, event, deleteEventApi,OnshowUpdateModal, renderStatus, rerender,box})=> {
   const navigate = useNavigate();
   const {id, describe, title, start, end} = event;
   const [top,setTop]=useState(0)

   useLayoutEffect( ()=>{
    if(box.y > 400)
setTop(+box.y-230)
else 
setTop(+box.y+20)
   },[box.y])
console.log(box)
   const handleDelete =async () => {
     await deleteEventApi(event.id);
     handleClose()
     rerender(!renderStatus)
   }
   return ReactDOM.createPortal(

    <div id="popup-modal" tabIndex="-1"  className={` delay-[5000ms] ease-in-out overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full`}>
    <div className="relative delay-[5000ms] ease-in-out  w-full max-w-md h-full md:h-auto ">
        <div className={`relative  delay-[5000ms] bg-white rounded-lg  shadow dark:bg-gray-700  `} style={{
            top: `${top}px`,
            left: `${box.x/2}px`,

          }}>
        <button type="button" onClick={handleClose} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
            </button>
            <div className="p-6 text-center space-y-3">
            <h1 className="text-xl font-bold my-2"> {title}</h1>
            {describe? <p className="lead">{describe}</p>: "Pas encore de description"}
            <div className="row justify-content-between">
              <p className="col small text-muted text-center pb-0 mb-0">De: {start}</p>
              <p className="col small text-muted text-center pb-0 mb-0">A: {end}</p>
            </div>
            {/* <button className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900" onClick={handleClose}>Fermer</button> */}
         <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={()=>{OnshowUpdateModal(true);handleClose()}}>Mise a jour</button>
            <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleDelete}>Supprimer</button>
            </div>
        </div>
    </div>
</div>
  ,

document.querySelector("#modal")

  
)
}
function mapStateToProps({event}){
    return {
      event,
     //  modalStatus
    }
 }
export default connect(mapStateToProps, {deleteEventApi, closeEvent})(Popping)