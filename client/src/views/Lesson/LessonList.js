import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Table, Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';
import { getSchedule } from '../../actions/scheduleActions';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import isEmptyObj from '../../validation/is-empty';
import Moment from 'react-moment'; 
import 'moment/locale/vi';
var moment = require('moment');

class LessonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      loading :true
    }

  }

  componentDidMount() {
    this.props.getSchedule(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {

    const { schedule, loading } = nextProps.schedule
    if(!isEmptyObj(schedule))
      this.setState({ 
        events: schedule.events,
        loading 
      });
    this.setState({
      loading 
    });  
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleEditLesson(lessonId){
    this.props.history.push(`/courses/${this.props.match.params.id}/edit-lesson/${lessonId}`);
  }

  handleLesson(lessonId){
    this.props.history.push(`/courses/${this.props.match.params.id}/lesson/${lessonId}`);
  }

  render() {
    var { events, loading } = this.state;
    const { role } = this.props.auth.user;
    return (
      <div className="animated fadeIn">
      {
        loading
        ?
        <ReactLoading type='bars' color='#05386B'/>
        :
        <Fragment>
          <Row>
            <Col>
            {
              events.length === 0
              ?
              <h3>Chưa có bài học</h3>
              :
              <Table hover dark responsive className="table-outline mb-0 d-none d-sm-table">
                <thead>
                  <tr>
                    <th>Ngày học</th>
                    <th>Giờ học</th>
                    <th>Tiêu đề</th>
                  </tr>
                </thead>
                <tbody>
                {
                  events.map(e=>
                    <tr key={e._id} className="changeCursor" onClick={this.handleLesson.bind(this, e._id)}>
                      <td>
                        {this.capitalizeFirstLetter(moment(e.date).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}
                      </td>

                      <td>
                        <Moment format="HH:mm - ">
                          {e.start}
                        </Moment>
                        <Moment format="HH:mm">
                          {e.end}
                        </Moment>
                      </td>
                      <td>
                        {e.text}
                      </td>
                    </tr>
                  )
                }
                </tbody>
              </Table>
            }
            </Col>
            {
              role === 'teacher' || 'admin'
              ?
              <Col xs="2">
              {
                events.length === 0
                ?
                null
                :
                <Table hover dark responsive className="table-outline mb-0 d-none d-sm-table">
                  <thead>
                    <tr>
                      <th className="text-center">Chỉnh sửa</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    events.map(e=>
                      <tr key={e._id} className="changeCursor" onClick={this.handleEditLesson.bind(this, e._id)}>
                        <td align='center'>
                          <i className="icon-pencil"></i>
                        </td>
                      </tr>
                    )
                  }
                  </tbody>
                </Table>
              }
              </Col>
              :
              null
            }
          </Row>
        </Fragment>
      }
      </div>
    )
  }
}

LessonList.propTypes = {
  schedule: PropTypes.object.isRequired,
  getSchedule: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  schedule: state.schedule,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { getSchedule })(LessonList));  