import React , { useEffect, useState } from 'react'
import { Calendar, dateFnsLocalizer,momentLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { enUS, fr } from 'date-fns/esm/locale'
import 'moment/locale/fr'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import Popping from './Popping';
import {closeEvent, ShowEventApi, ShowEventsApi,updateEventApi} from "../Redux/actions"
import { connect } from 'react-redux'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import Popp from './Popp'
import ModalUpdateEvent from './ModalUpdateEvent'

import {DocumentFullScreen} from "@chiragrupani/fullscreen-react"
const locales = {
  fr: fr,
}
const localizer = momentLocalizer(moment);




const DnDCalendar = withDragAndDrop(Calendar);


const MyCalendar = ({events, ShowEventApi,darkMode, closeEvent, ShowEventsApi,updateEventApi,showModal,setShowModal,fullscreen,setFullscreen}) => {
    const [open, setOpen] = useState(false);
    const [box,setBox] = useState("");
    const [renderStatus, rerender] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [idEvent, setIdEvent] = useState("");
    const [selectEvent,setSelectEvent] = useState({});
    const mode=localStorage.getItem("mode")
    const eventStyleGetter=(event, start, end, isSelected)=> {
      console.log(event);
      var backgroundColor = '#' + event.hexColor;
      var style = {
          backgroundColor: backgroundColor,
          borderRadius: '0px',
          opacity: 0.8,
          color: 'black',
          border: '0px',
          display: 'block'
      };
      return {
          style: style
      };
  }
    useEffect(()=>{
      ShowEventsApi()
      console.log("i renderd because of refresh or start");
    },[events.start,events.date])


    useEffect(()=>{
      ShowEventsApi()
      console.log("i renderd");
    },[renderStatus])

    const openEventClick = async (event,box)=>{
         setBox({x:box.clientX,y:box.clientY})
         const id=event.id||event._id
         setIdEvent(String(id))
         if(id ) {
          await ShowEventApi( String(event.id));
          setOpen(true)

         }


         return ;
    }

    const closeEventClick = () =>{
      setOpen(false);
      setTimeout(()=>closeEvent(),300) ;
    }

  const onEventResize = (data) => {
    const { start, end } = data;
    
    updateEventApi({...data.event,start,end},String(data.event.id))
    // const renderedEvents = eventsC.filter(event => event.id !==data.id);

    // setEventsC([...renderedEvents,{...data,start,end}])
    // return [...renderedEvents,{...action.payload,id:action.payload.id}]

    // rerender(true)

    // console.log("test",{start,end,...data.event})

    // this.setState((state) => {
    //   state.events[0].start = start;
    //   state.events[0].end = end;
    //   return { events: [...state.events] };
    // });
  };
  const resizeEvent = (data) => {

    const { start, end } = data;
    console.log("data.event.id",data.event.id)

    updateEventApi({...data.event,start,end},data.event.id)


  };
  let style=fullscreen && darkMode?{width:"100vw",height:"100vh" ,padding:"2px",backgroundColor:"black",color:"white"}:fullscreen && !darkMode?{ width:"100vw",height:"100vh" ,padding:"2px",backgroundColor:"white",color:"black" }:!fullscreen && darkMode?{ height: 500 , margin: 20,backgroundColor:"black",color:"white" }:{ height: 500 , margin: 20,backgroundColor:"white",color:"black" }
    return (
      <div className={` ${darkMode ?"black":"white"} `}>
      <DocumentFullScreen
        isFullScreen={fullscreen}
        onChange={() => setFullscreen(!fullscreen)}
       
      >
                  {showModal && <Modal OnshowModal={setShowModal} event={selectEvent}/>}
                  {showUpdateModal && <ModalUpdateEvent id={idEvent} OnshowUpdateModal={setShowUpdateModal} event={selectEvent}/>}
        {box && open &&
        <Popp
        box={box}
         handleOpen={openEventClick}
         handleClose={closeEventClick}
         renderStatus = {renderStatus}
         OnshowUpdateModal={setShowUpdateModal}
         rerender= {rerender}/>
        }

        <DnDCalendar
        selectable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={style}
            onSelectEvent={openEventClick}
            onEventDrop={resizeEvent}
            onEventResize={onEventResize}
                  // dayPropGetter={calendarStyle}
        
            // onSelectSlot={(event)=>navigate('/events/add',{state:{event}})}
            // eventPropGetter={eventStyleGetter}

            onSelectSlot={event =>{
              setSelectEvent(event)

              setShowModal(true)
              // alert(
            //   `selected slot: \n\nstart ${event.start.toLocaleString()} ` +
            //     `\nend: ${event.end.toLocaleString()}` +
            //     `\naction: ${event.action}`
            // )
            // navigate('/events/add',{state:{event}})
            }
          }
            resizable


            messages={{
                    next: "Suivant",
                    previous: "Précédent",
                    today: "Aujourd'hui",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour"
                  }}
        />
        {/* messages={{
                    next: "Suivant",
                    previous: "Précédent",
                    today: "Aujourd'hui",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour"
                  }} */}

    </DocumentFullScreen>
</div>
    )
}

function mapStateToProps({event, events}){
  return{
    event,
    events
  }
}

export default connect(mapStateToProps, {ShowEventApi, closeEvent, ShowEventsApi,updateEventApi})(MyCalendar)