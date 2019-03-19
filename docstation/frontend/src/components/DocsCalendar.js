import React, { Component } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-responsive-modal";
import DecisionDialog from '../DisionDialoge';
import {firebase, GoogleAuthProvider} from '../firebase';

const localizer = Calendar.momentLocalizer(moment);

class DocsCalendar extends Component {
  state = {
     events: []
  };
  
  //Getting the 'termine' from the logged-in user
  componentDidMount(){
    return firebase.auth().onAuthStateChanged(user => {
      if(user){
        //retrieve the logged in users dates
        var ref = firebase.database().ref('users/'+ user.uid + "/termine");
        ref.on("child_added", snap => {
          var eintragId = snap.ref.path.pieces_[3];
          var title = snap.child("title").val();
          var start = snap.child("date/start").val();
          var ende = snap.child("date/ende").val();
          let termin = {start: new Date(start), end: new Date(ende), title: title, id: eintragId};
          this.setState({
            events:[...this.state.events, termin],
          });
          console.log("Title: " + title + "   Startzeit: " +  start + "   Endzeit: " + ende);
          console.log(this.state);
          this.forceUpdate();
        });
      }else{
        console.log('Termine konnten nicht abgerufen werden');
      }
    }
)
  }

  componentDidUpdate(){
    /*//Wenn der Title string leer ist, wird kein neues Event erstellt. 
    if(this.props.title  !== "" ){
      const newEvent = {
        start: this.props.event[0],
        end: this.props.event[1],
        title: this.props.title
      }
      if(JSON.stringify(newEvent) === JSON.stringify(this.state.events[this.state.events.length -1])){
        console.log("doppelt");
      } else {
       this.state.events.push(newEvent);
      }
    } 
  }

  onOpenModal = () => {
    this.setState({ open: true,
      isUpdated: false
     });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };


  onSelectEvent() {
    this.onOpenModal();
  }

  deleteEvent = pEvent => {
    this.setState((prevState, props) => {
      const events = [...prevState.events]
      const idx = events.indexOf(pEvent)
      events.splice(idx, 1);
      return { events };
    });
    this.onCloseModal();
  }
  

  render() {
    return (
      <div>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="week"
          events={this.state.events}
          style={{ height: "50vh", width: "50vw" }}
          className="calendar"
          onSelectEvent = {event => this.onSelectEvent(event)}
        />
        <Modal open={this.state.open} onClose={this.onCloseModal} center>
        <DecisionDialog
          onCloseModal={this.onCloseModal}
          pushDate={this.pushDate}
          title="Möchten Sie Ihren Termin wirklich löschen?"
          deleteEvent={this.deleteEvent}
        />
      </Modal>
      </div>
    );
  }
}

export default DocsCalendar;
