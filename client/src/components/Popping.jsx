import { Modal, Button } from "react-bootstrap";
import React, { useState } from "react";
import "../style/model.scss"
import { connect } from "react-redux";
import {Link} from "react-router-dom"
import { deleteEventApi, ShowEventsApi, closeEvent } from "../Redux/actions";
import { useNavigate } from "react-router-dom";

const Popping = ({open, handleClose, event, deleteEventApi, renderStatus, rerender})=> {
   const navigate = useNavigate();
   const {id, describe, title, start, end} = event;

   const handleDelete =async () => {
     await deleteEventApi(event.id);
     rerender(!renderStatus)
   }

   

   const modal = ()=>{
     return (
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title className="text-capitalize">{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {describe? <p className="lead">{describe}</p>: "Pas encore de description"}
            <div className="row justify-content-between">
              <p className="col small text-muted text-center pb-0 mb-0">de: {start}</p>
              <p className="col small text-muted text-center pb-0 mb-0">a: {end}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900" onClick={handleClose}>Fermer</Button>
            <Link to={`/event/${id}/update`}><Button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Mise a jour</Button></Link>
            <Button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
     )
   }

   if(id){
     return modal()
   }else{
     <p>there is no modal to preview</p>
   }
   
  }

  function mapStateToProps({event}){
     return {
       event,
      //  modalStatus
     }
  }
  
  export default connect(mapStateToProps, {deleteEventApi, closeEvent})(Popping)