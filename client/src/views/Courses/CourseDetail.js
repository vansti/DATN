import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TabContent, TabPane, Nav, NavItem, NavLink, CardBody, CardHeader, Card } from 'reactstrap';
import classnames from 'classnames';
import { getUsers } from '../../actions/userActions';
import { getCourseInfo } from '../../actions/courseActions';
import PeopleInCourse from '../../components/PeopleInCourse';
import PostInCourse from '../../components/PostInCourse';
import ReactLoading from 'react-loading';

class CourseDetail extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      courseinfo: [],
      loading: true,
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
    this.props.getCourseInfo(this.props.match.params.id);
    this.props.getUsers(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { courseinfo, loading } = nextProps.courses
      this.setState({
        courseinfo,
        loading
      })
    }
  }

  render() {
    const { courseinfo, loading } = this.state

    return (
      <div className="animated fadeIn">
        <Card>
        {
          loading
          ?
          <ReactLoading type='bars' color='#05386B'/>
          :
          <Fragment>
            <CardHeader>
              <i className="fa fa-align-justify"></i><strong>{courseinfo.course.title}</strong>
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
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.toggle('3');}}
                  >
                    Câu hỏi
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
          </Fragment>
        }
        </Card>

      </div>
    )
  }
}

CourseDetail.propTypes = {
  getCourseInfo : PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired,
  getUsers : PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getUsers, getCourseInfo })(CourseDetail); 
