import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardBody,
  ListGroupItem,
  CardHeader,
  Button,
  Collapse,
  ListGroup
} from 'reactstrap';
import ModalAdd from './ModalAdd';
import { getLessonList } from '../../actions/lessonActions';
import ReactLoading from 'react-loading';

class LessonList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accordion: [],
      lesson_list: [],
      loading: true
    };
  }

  componentDidMount = () => {
    this.props.getLessonList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lesson) {
      const { lesson_list, loading } = nextProps.lesson
      var accordion = [];
      lesson_list.map(()=>accordion.push(false));
      this.setState({
        accordion,
        lesson_list,
        loading
      })
    }
  }

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  handleEditLesson(listId, lessonId){
    this.props.history.push(`/lesson-list/edit-lesson/${listId}/${lessonId}`);
  }

  render() {
    const { lesson_list, loading } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>
            <ModalAdd/>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Fragment>
              {
                lesson_list.length === 0
                ?
                <ListGroupItem style={{marginTop:10}}>Chưa có danh sách bài học</ListGroupItem>
                :
                <Fragment>
                {
                  lesson_list.map((list, index) => 
                    <Card className="mb-0" key={list._id} style={{marginTop:10}}>
                      <CardHeader style={{backgroundColor: 'lightblue'}}>
                        <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[index]} aria-controls="collapseOne">
                          <h5 className="m-0 p-0" style={{color: 'black'}}>{list.title}</h5>
                        </Button>
                      </CardHeader>
                      <Collapse isOpen={this.state.accordion[index]} data-parent="#accordion" id="collapseOne">
                        <CardBody>
                          <ListGroup>
                            {
                              list.lesson.map(lesson=>
                                <ListGroupItem key={lesson._id} action tag="button" onClick={this.handleEditLesson.bind(this, list._id, lesson._id)}>
                                  <span>{lesson.text}</span>
                                </ListGroupItem>
                              )
                            }
                          </ListGroup>
                        </CardBody>
                      </Collapse>
                    </Card>
                  )
                }
                </Fragment>
              }
              </Fragment>
            }
          </CardBody>
        </Card>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  lesson: state.lesson
});

export default connect(mapStateToProps, { getLessonList })(LessonList);  