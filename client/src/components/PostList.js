import React, { Component,Fragment } from 'react';
import { 
  Card, CardHeader, 
  CardBody, Button, 
  Collapse, ListGroupItem, 
  Row, Col, CardFooter, 
  ListGroup 
} from 'reactstrap';
import { connect } from 'react-redux';
import { getExerciseList } from '../actions/exerciseActions';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import isEmptyObj from '../validation/is-empty';
import ReactLoading from 'react-loading';
import Moment from 'react-moment'; 
import PostComments from './PostComments';
import SubmitExercise from './SubmitExercise';
import NoImg from '../assets/img/NoImg.png';

class PostList extends Component {
  constructor(props) {
    super(props);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.state = {
      accordion: [],
      exercises: [],
      loading: true
    };
  }

  componentDidMount = () => {
    this.props.getExerciseList(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.exercises)) {
      const {exercises, loading} = nextProps.exercises
      var accordion = [];
      exercises.map(()=>accordion.push(false))
      this.setState({
        accordion,
        exercises,
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
    this.score = this.score.bind(this);
  }
  score(exerciseId){
    this.props.history.push(`/score/${this.props.match.params.id}/${exerciseId}`)
  }
  render() {
    const { exercises, loading } = this.state;
    return (
      <Fragment>
        <div id="accordion">
          <br/>
          <br/>
          {
            loading
            ?
            <ReactLoading type='bars' color='#05386B' height={100} width={50} />
            :
            <Fragment>
            {
              exercises.length === 0
              ?
              <h4>Hiện không có bài tập nào!</h4>
              :
              exercises.map((exercise,index) => 
                <Card className="mb-0" key={index}>
                  <CardHeader id="headingOne">
                    <Row>
                      <Col xs="10">
                        <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[index]} aria-controls="collapseOne">
                          <h5 className="m-0 p-0">{exercise.title}</h5>
                        </Button>
                        <small>  
                          <Moment format="Đã đăng vào HH:mm ngày DD/MM/YYYY">
                            {exercise.created}
                          </Moment>
                        </small>
                      </Col>
                      <Col >
                        <small>                  
                          Hạn
                          <Moment format=" HH:mm ngày DD/MM/YYYY">
                            {exercise.deadline}
                          </Moment>
                        </small>
                      </Col>
                    </Row>
                  </CardHeader>
                  <Collapse isOpen={this.state.accordion[index]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                    <CardBody>
                      {
                        exercise.text.split('\n').map((itemChild, key) => {
                          return <span key={key}>{itemChild}<br/></span>
                        })
                      }
                      <br/>
                      <ListGroup>
                        {
                          exercise.attachFiles.map(file=>
                            <ListGroupItem key={file.id} action tag="a" href={file.url}>
                              {
                                file.thumbnail
                                ?
                                <img src={file.thumbnail} alt=""/> 
                                :
                                <img src={NoImg} style={{width:47}} alt=""/> 
                              }  
                              <span style={{marginLeft:10}}>{file.name}</span>
                            </ListGroupItem>
                          )
                        }
                      </ListGroup>
                      <br/>
                      <Button block color="success" onClick={this.score.bind(this, exercise._id)} >Chấm điểm</Button>
                      <SubmitExercise exerciseId={exercise._id}/>
                    </CardBody>
                    <CardFooter>
                      <PostComments exercise={exercise}/>
                      
                    </CardFooter>
      
                  </Collapse>
                </Card>
              )
            }
            </Fragment>
          }
        </div>
      </Fragment>
    )
  }
}

PostList.propTypes = {
  getExerciseList: PropTypes.func.isRequired,
  exercises: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  exercises: state.exercises,
});

export default  withRouter(connect(mapStateToProps, { getExerciseList })(PostList));  