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

const locales = {
  fr: fr,
}
const localizer = momentLocalizer(moment);




const DnDCalendar = withDragAndDrop(Calendar);


const MyCalendar = ({events, ShowEventApi, closeEvent, ShowEventsApi,updateEventApi}) => {
    const [open, setOpen] = useState(false);
    const [box,setBox] = useState("");
    const [renderStatus, rerender] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectEvent,setSelectEvent] = useState({});
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
    const navigate = useNavigate()
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
         if(event.id ) {
          await ShowEventApi( event.id);
          setOpen(true)

         }
         else if(event._id ) {
         await ShowEventApi( event._id);
          setOpen(true)

         }
         
         return;
    }

    const closeEventClick = () =>{
      setOpen(false);
      setTimeout(()=>closeEvent(),300) ;
    }
    
  const onEventResize = (data) => {
    const { start, end } = data;
    updateEventApi({...data.event,start,end},data.event.id)
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
    console.log("data",showModal);
  };
  const resizeEvent = (data) => {
  
    const { start, end } = data;
    updateEventApi({...data.event,start,end},data.event.id)

   
  };
    return (
    <div>
                  {showModal && <Modal OnshowModal={setShowModal} event={selectEvent}/>} 
        
        {box && open &&
        <Popp 
        box={box}
         handleOpen={openEventClick} 
         handleClose={closeEventClick} 
         renderStatus = {renderStatus} 
         rerender= {rerender}/>
        }

        <DnDCalendar
        selectable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 , margin: 50, fontFamily: 'Patrick Hand' }}
            onSelectEvent={openEventClick}
            onEventDrop={resizeEvent}
            onEventResize={onEventResize}
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
            
            onDropFromOutside={()=>alert("ok")}

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