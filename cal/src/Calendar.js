import React, { Component } from "react";
import "./css/calendar.css";
import FullCalendar from "fullcalendar-reactwrapper";
import interactionPlugin from "@fullcalendar/interaction";
import clsx from "clsx";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
//import $ from "jquery";
//import Button from "@material-ui/core/Button";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Modal from "react-modal";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import EventCard from "./EventCard";

import { Container, Button, Link } from "react-floating-action-button";

import "font-awesome/css/font-awesome.min.css";

import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import { IconButton } from "@material-ui/core";
import ToolTip from "react-tooltip-lite";
import { width } from "@material-ui/system";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%,-50%)",
    borderRadius: "20px",
    // overflow: "hidden",
    borderStyle: "solid",
    borderColor: "#0C4E93"
    // width: "24rem"
  }
};

const TabContainer = function(props) {
  return (
    <Typography component="div" style={{ padding: 0, textAlign: "center" }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = { children: PropTypes.node.isRequired };
export default class Calendar extends Component {
  constructor(props) {
    super(props);
    // var date = ;
    this.state = {
      eventData: {},
      createEventModal: false,
      editEventModal: false,
      dateRequired: "dispNone",
      validDate: "dispNone",
      validTime: "dispNone",
      eventTimeRequired: "dispNone",
      eventDurationRequired: "dispNone",
      eventDescriptionRequired: "dispNone",
      verified: false,
      eventClick: "dispNone",
      editBtnClick: "dispNone",
      deleteBtnClick: "dispNone",
      calendarEvents: [
        {
          id: "a",
          title: "Good Morning!!",
          start: Date.now(),
          slotDuration: "00:15:00",
          resourceEditable: true
        }
      ]
    };
    this.baseState = this.state.eventData;
  }

  componentDidMount() {
    axios
      .get("http://localhost:8080/api/set_schedule_doctor", {
        headers: {
          encoded:
            "de53f22f6998d6f4fa5d62e757719c83f09be485a19092632021a1de56b309d3ab4191f1c2a0a02c1f6370b8bf5f427b7f4bd0ae231d1dfc621c35eb7e73d25dad7c9ea94f0a170534103fff0e354ee327fb6fcfe5ab87754d52fe21775d1b5b26e2587b63f9"
        }
      })
      .then(res => {
        console.log("EventResponse:", res.data);
        this.setState({
          //calendarEvents: [...this.state.calendarEvents, res.data[0].cal]
          calendarEvents: res.data[0].cal
        });
      })
      .catch(e => {
        console.log("Error in fetching calendar records:", e);
      });
  }

  render() {
    //const classes = this.props;
    return (
      <div id="example-component">
        <FullCalendar
          id="your-custom-ID"
          header={{
            left: "prev,next today myCustomButton",
            center: "title",
            right: "month,basicWeek,basicDay"
          }}
          plugins={[dayGridPlugin, interactionPlugin]}
          defaultDate={Date.now()}
          navLinks={true} // can click day/week names to navigate views
          editable={false}
          eventLimit={true} // allow "more" link when too mants
          events={this.state.calendarEvents}
          // selectable
          // selectHelper
          //select={}
          allDay={true}
          eventClick={this.eventClickHandler.bind(this.props.event)}
          displayEventEnd={true}
        />

        <Modal
          closeTimeoutMS={1000}
          ariaHideApp={true}
          isOpen={this.state.createEventModal}
          contentLabel={Event}
          onRequestClose={this.handleCreateClose}
          style={customStyles}
        >
          <Typography
            variant="h5"
            style={{
              textAlign: "center",
              color: "#0C4E93",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen"
            }}
          >
            <b>Create Event</b>
            <span className="closeBtn">
              <i className="fa fa-remove " onClick={this.handleCreateClose} />
            </span>
          </Typography>
          <br />
          <TabContainer>
            <FormControl required className="formControl">
              <TextField
                //className=""
                name="eventDate"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                label="Enter Date"
                onChange={this.onChangeHandler}
              />
              <FormHelperText className={this.state.dateRequired}>
                <span className="red">Please select a date!!</span>
              </FormHelperText>
              <FormHelperText className={this.state.validDate}>
                <span className="red">Please select a valid date!!</span>
              </FormHelperText>
            </FormControl>
            <br /> <br />
            <FormControl required className="formControl">
              <TextField
                type="time"
                onChange={this.onChangeHandler}
                name="eventTime"
                variant="outlined"
                label="Enter Time"
                InputLabelProps={{ shrink: true }}
              />
              <FormHelperText className={this.state.eventTimeRequired}>
                <span className="red">Please select time!!</span>
              </FormHelperText>
              <FormHelperText className={this.state.validTime}>
                <span className="red">Please select a valid time!!</span>
              </FormHelperText>
            </FormControl>
            <br /> <br />
            <FormControl required className="formControl">
              <TextField
                type="text"
                onChange={this.onChangeHandler}
                name="eventDescription"
                variant="outlined"
                label="Event Description"
              />
              <FormHelperText className={this.state.eventDescriptionRequired}>
                <span className="red">Please describe your event!!</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required className="formControl">
              <TextField
                type="text"
                placeholder="hh:mm:ss"
                onChange={this.onChangeHandler}
                name="eventDuration"
                variant="outlined"
                label="Event Duration"
                InputLabelProps={{ shrink: true }}
              />
              <FormHelperText className={this.state.eventDurationRequired}>
                <span className="red">Event duration required!!</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <div id="event" className="parent">
              <i
                className="fa fa-paper-plane fa-2x"
                onClick={this.createSubmitHandler}
                style={{ color: "#0C4E93" }}
              />
            </div>
          </TabContainer>
        </Modal>
        {/* *************************************************************************************** */}
        <Modal
          isOpen={this.state.editEventModal}
          onRequestClose={this.handleEditClose}
          style={customStyles}
        >
          <div id="editEventModal" className={this.state.editBtnClick}>
            <Typography
              variant="h5"
              style={{
                textAlign: "center",
                color: "#0C4E93",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen"
              }}
            >
              <b>Edit Event</b>
              <span className="closeBtn">
                <i className="fa fa-remove " onClick={this.handleEditClose} />
              </span>
            </Typography>
            <br />
            <TabContainer>
              <FormControl required className="formControl">
                <TextField
                  //className=""
                  name="eventDate"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  label="Enter Date"
                  value={this.state.eventData.eventDate}
                  onChange={this.onChangeHandler}
                />
                <FormHelperText className={this.state.dateRequired}>
                  <span className="red">Please select a date!!</span>
                </FormHelperText>
              </FormControl>
              <br /> <br />
              <FormControl required className="formControl">
                <TextField
                  type="time"
                  onChange={this.onChangeHandler}
                  name="eventTime"
                  variant="outlined"
                  label="Enter Time"
                  InputLabelProps={{ shrink: true }}
                  value={this.state.eventData.eventTime}
                />
                <FormHelperText className={this.state.eventTimeRequired}>
                  <span className="red">Please select time!!</span>
                </FormHelperText>
              </FormControl>
              <br /> <br />
              <FormControl required className="formControl">
                <TextField
                  type="text"
                  onChange={this.onChangeHandler}
                  name="eventDescription"
                  variant="outlined"
                  label="Event Description"
                  InputLabelProps={{ shrink: true }}
                  value={this.state.eventData.eventDescription}
                />
                <FormHelperText className={this.state.eventDescriptionRequired}>
                  <span className="red">Please describe your event!!</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required className="formControl">
                <TextField
                  type="text"
                  placeholder="hh:mm:ss"
                  onChange={this.onChangeHandler}
                  name="eventDuration"
                  variant="outlined"
                  label="Event Duration"
                  InputLabelProps={{ shrink: true }}
                  value={this.state.eventData.eventDuration}
                />
                <FormHelperText className={this.state.eventDurationRequired}>
                  <span className="red">Event duration required!!</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <button
                className="btn btn-primary btn-sm "
                id="calEdit2"
                onClick={this.editSubmitHandler}
                style={{
                  marginRight: "10px"
                }}
              >
                <i class="fa fa-pencil-square-o" />
              </button>
            </TabContainer>
          </div>
          {/* *************************************************************/}
          <div id="eventDetails" className={this.state.eventClick}>
            <span className="closeBtn">
              <i className="fa fa-remove " onClick={this.handleEventClose} />
            </span>
            <p
              className="typoStyle "
              variant="h5"
              style={{
                color: "#0C4E93",
                fontFamily: "'Libre Caslon Text', serif",
                borderRadius: "5px",
                backgroundColor: "lightBlue"
              }}
            >
              Your Event Details
            </p>

            {/* <hr className="barStyle" /> */}

            {/* <Typography className="typoStyle" variant="h6">
              {this.state.eventData.eventDescription}
            </Typography> */}
            <p className="typoStyle">{this.state.eventData.eventDescription}</p>
            <p
              className="typoStyle"
              style={{
                marginTop: "20px",
                backgroundColor: "lightBlue",
                borderRadius: "5px"
              }}
            >
              {this.state.eventData.eventTime}&nbsp;&nbsp;&nbsp;
              {this.state.eventData.eventDate}&nbsp;&nbsp;&nbsp;
              {this.state.eventData.eventDuration}&nbsp;&nbsp;&nbsp;
            </p>
            {/* <p
              className="typoStyle"
              style={{ marginLeft: "300px", marginTop: "20px" }}
            > */}

            {/* </p>
            <p
              className="typoStyle"
              style={{ marginLeft: "300px", marginTop: "30px" }}
            > */}

            {/* </p> */}
            <span style={{ marginLeft: "200px" }}>
              <button
                className="btn btn-primary btn-sm "
                id="calEdit1"
                onClick={this.editBtnClick}
              >
                <i class="fa fa-pencil-square-o " />
              </button>
              <button
                className="btn btn-danger btn-sm "
                id="calDelete1"
                onClick={this.deleteBtnClick}
              >
                <i class="fa fa-trash " />
              </button>
            </span>
          </div>
          {/****************************************************** */}
          <div id="deleteBtnModal" className={this.state.deleteBtnClick}>
            <Typography className="typoStyle">
              Are you sure you want to delete this event?
            </Typography>
            <span style={{ marginLeft: "70px" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={this.handleEventDeleteYes}
              >
                Yes
              </button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <button
                className="btn btn-danger btn-sm"
                onClick={this.handleEventDeleteNo}
              >
                No
              </button>
            </span>
          </div>
        </Modal>

        <Container>
          <Button
            tooltip="Add new event!!"
            onClick={this.openEventModal}
            icon={"fa fa-plus-circle fa-2x"}
            styles={{
              backgroundColor: "#0C4E93",
              color: "white"
            }}
          />
        </Container>

        <br />
      </div>
    );
  }

  handleEventClose = e => {
    this.setState({
      editEventModal: false,
      eventClick: "dispNone",
      deleteBtnClick: "dispNone"
    });
  };
  handleEventDeleteYes = e => {
    console.log("Delete Handler Called...");
    console.log(this.state.eventData);
    axios
      .post(
        "http://localhost:8080/api/delete_schedule_doctor",
        this.state.eventData,
        {
          headers: {
            encoded:
              "de53f22f6998d6f4fa5d62e757719c83f09be485a19092632021a1de56b309d3ab4191f1c2a0a02c1f6370b8bf5f427b7f4bd0ae231d1dfc621c35eb7e73d25dad7c9ea94f0a170534103fff0e354ee327fb6fcfe5ab87754d52fe21775d1b5b26e2587b63f9"
          }
        }
      )
      .then(res => console.log(res.data));
    this.setState({ deleteBtnClick: "dispNone" });
  };
  handleEventDeleteNo = e => {
    this.setState({ deleteBtnClick: "dispNone", eventClick: "dispBlock" });
  };

  resetStateHandler() {
    this.setState({ eventData: this.baseState });
  }

  openEventModal = e => {
    this.resetStateHandler();
    this.setState({ createEventModal: true });
  };
  handleCreateClose = e => {
    // var classes = document
    //   .querySelector(".closeBtn")
    //   .classList.toggle("modal-animation");
    this.setState({ createEventModal: false });
  };
  handleEditClose = e => {
    this.setState({
      editEventModal: false,
      editBtnClick: "dispNone",
      eventClick: "dispNone",
      deleteBtnClick: "dispNone"
    });
  };
  // handleEventClose =e =>{
  //   this.setState({editBtnClick:"dispNone"})
  // }
  eventClickHandler = calEvent => {
    this.setState({ eventClick: "dispBlock" });
    //**********/
    this.setState({ editEventModal: true });
    console.log("event is clicked!!");
    console.log(calEvent);

    console.log(calEvent.title);
    var arr = calEvent.start._i.split("T");
    console.log(arr);
    let eventData = {
      eventId: calEvent._id,
      eventDate: arr[0],
      eventTime: arr[1],
      eventDescription: calEvent.title,
      eventDuration: calEvent.slotDuration
    };
    console.log("dattaBefore:", JSON.stringify(this.state.eventData));
    this.setState(
      {
        eventData
      },
      () => {
        console.log("dattaAftr:", JSON.stringify(this.state.eventData));
      }
    );
  };

  editBtnClick = e => {
    this.setState({ eventClick: "dispNone", editBtnClick: "dispBlock" });
  };
  deleteBtnClick = e => {
    this.setState({ eventClick: "dispNone", deleteBtnClick: "dispBlock" });
  };

  editSubmitHandler = e => {
    console.log(this.state.eventData);
    console.log("edit submit handler called");
    let editObj = {
      id: this.state.eventData.eventId,
      title: this.state.eventData.eventDescription,
      start:
        this.state.eventData.eventDate + "T" + this.state.eventData.eventTime,
      slotDuration: this.state.eventData.eventDuration,
      time: this.state.eventData.eventTime
      //allDay: true
    };
    console.log("edit obj id", editObj.id);

    axios
      .post("http://localhost:8080/api/edit_schedule_doctor", editObj, {
        headers: {
          encoded:
            "de53f22f6998d6f4fa5d62e757719c83f09be485a19092632021a1de56b309d3ab4191f1c2a0a02c1f6370b8bf5f427b7f4bd0ae231d1dfc621c35eb7e73d25dad7c9ea94f0a170534103fff0e354ee327fb6fcfe5ab87754d52fe21775d1b5b26e2587b63f9"
        }
      })
      .then(res => {
        console.log(res);
        console.log(res.data.status);

        if (res.data.status === "Success!!") {
          this.setState({
            calendarEvents: [...this.state.calendarEvents],
            editObj
          });
          console.log("updated events", this.state.calendarEvents);

          var index = this.state.calendarEvents.findIndex(
            x => x.id === parseInt(editObj.id)
          );
          console.log(index);
          console.log("b4 splice", this.state.calendarEvents);
          var xyz = this.state.calendarEvents.splice(index, 1, editObj);
          //this.setState({ calendarEvents: [...] });
          console.log(xyz);
          console.log("aftersplice", this.state.calendarEvents);
        }
      })
      .catch(err => {
        console.log("error:", err);
      });
  };

  createSubmitHandler = e => {
    debugger;
    // let today = new Date();
    // let date1 = new Date(today);
    // console.log(date1);
    // let mm = today.getMonth();
    // let yy = today.getFullYear();
    // let dd = today.getDate();
    // var date = dd + "-" + (mm + 1) + "-" + yy;
    // console.log(typeof this.state.eventData.eventDate);
    // console.log(typeof date);
    // this.state.eventData.eventDate < date
    //   ? this.setState({ validDate: "dispBlock" })
    //   : this.setState({ validDate: "dispNone" });
    // this.state.eventData.eventTime < today.getTime()
    //   ? this.setState({ validTime: "dispBlock" })
    //   : this.setState({ validTime: "dispNone" });
    typeof this.state.eventData.eventDate === "undefined"
      ? this.setState({ dateRequired: "dispBlock" })
      : this.setState({ dateRequired: "dispNone" });
    typeof this.state.eventData.eventTime === "undefined"
      ? this.setState({ eventTimeRequired: "dispBlock" })
      : this.setState({ eventTimeRequired: "dispNone" });
    typeof this.state.eventData.eventDescription === "undefined"
      ? this.setState({ eventDescriptionRequired: "dispBlock" })
      : this.setState({ eventDescriptionRequired: "dispNone" });
    typeof this.state.eventData.eventDuration === "undefined"
      ? this.setState({ eventDurationRequired: "dispBlock" })
      : this.setState({ eventDurationRequired: "dispNone" });

    if (
      // this.state.eventData.eventDate >= date &&
      // this.state.eventData.eventTime >= today.getTime() &&
      typeof this.state.eventData.eventDate !== "undefined" &&
      typeof this.state.eventData.eventTime !== "undefined" &&
      typeof this.state.eventData.eventDescription !== "undefined" &&
      typeof this.state.eventData.eventDuration !== "undefined" &&
      typeof this.state.eventData.eventDate !== null &&
      typeof this.state.eventData.eventTime !== null &&
      typeof this.state.eventData.eventDescription !== null &&
      typeof this.state.eventData.eventDuration !== null
    ) {
      this.setState({ verified: true }, () => {
        console.log("trigered");
        var classes = document
          .querySelector(".parent")
          .classList.toggle("event-animation");
        var timeStamp = new Date().getUTCMilliseconds();
        console.log(timeStamp);
        let obj = {
          id: timeStamp,
          title: this.state.eventData.eventDescription,
          start:
            this.state.eventData.eventDate +
            "T" +
            this.state.eventData.eventTime,
          slotDuration: this.state.eventData.eventDuration,
          time: this.state.eventData.eventTime,
          allDay: true
        };
        console.log(obj);
        axios
          .post("http://localhost:8080/api/set_schedule_doctor", obj, {
            headers: {
              encoded:
                "de53f22f6998d6f4fa5d62e757719c83f09be485a19092632021a1de56b309d3ab4191f1c2a0a02c1f6370b8bf5f427b7f4bd0ae231d1dfc621c35eb7e73d25dad7c9ea94f0a170534103fff0e354ee327fb6fcfe5ab87754d52fe21775d1b5b26e2587b63f9"
            }
          })
          .then(res => {
            console.log("createEventResponse:", res.data);
          });
        setTimeout(() => {
          console.log(this.state.verified);

          this.setState({
            calendarEvents: [...this.state.calendarEvents, obj],
            createEventModal: false,
            verified: false

            //slotDuration: "00:15:00"
          });
        }, 1000);
      });
    }
  };

  onChangeHandler = e => {
    this.setState({
      eventData: { ...this.state.eventData, [e.target.name]: e.target.value }
    });
  };

  // handleDateClick = select => {
  //   //this.setState({ formStyle: true });

  //   //console.log(select);
  //   let d = new Date(select._d);
  //   let mm = d.getMonth();
  //   let yy = d.getFullYear();
  //   let dd = d.getDate();
  //   var date1 = yy + "-" + "0" + (mm + 1) + "-" + dd;

  //   //console.log("Date:" + date1 + "type:" + typeof date1);
  //   this.setState({ eventDate: date1 });
  // };
}
