import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TabContent, TabPane, Nav, NavItem, NavLink, CardBody, CardHeader, Card } from 'reactstrap';
import classnames from 'classnames';
import { getCurentCourse } from '../../actions/courseActions';
import { getUsers } from '../../actions/userActions';
import PeopleInCourse from '../../components/PeopleInCourse';
import PostInCourse from '../../components/PostInCourse';

class CourseDetail extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentDidMount = () => {
    this.props.getCurentCourse();

    var arr={};
    arr.courseid = this.props.match.params.id
    this.props.getUsers(arr);
  }

  render() {
    var course='';
    if(this.props.courses.currentcourses != null)
    {
      course = this.props.courses.currentcourses.find(course => course._id.toString() === this.props.match.params.id);

    }



    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i><strong>{course.title}</strong>
          </CardHeader>
          <CardBody>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                >
                  Bài tập
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2');}}
                >
                  Mọi người
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <PostInCourse />
              </TabPane>
              <TabPane tabId="2">
                <PeopleInCourse />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    )
  }
}

CourseDetail.propTypes = {
  getCurentCourse : PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired,
  getUsers : PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getUsers,getCurentCourse })(CourseDetail); 
