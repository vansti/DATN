import React, { Component,Fragment } from 'react';
import { 
  Card, CardHeader, 
  CardBody, Button, 
  Collapse, ListGroupItem, 
  Row, Col, CardFooter, 
  ListGroup 
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Moment from 'react-moment'; 
import ExerciseComments from './ExerciseComments';
import SubmitExercise from './SubmitExercise';

import NoImg from '../../../assets/img/NoImg.png';

class ExerciseList extends Component {
  constructor(props) {
    super(props);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.state = {
      accordion: [],
      exercises: []
    };
  }

  componentWillReceiveProps = (nextProps) => {
    var accordion = [];
    nextProps.exercises.map(()=>accordion.push(false));
    this.setState({
      accordion,
      exercises: nextProps.exercises
    })
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
    const { exercises } = this.state;
    const { role } = this.props.auth.user

    return (
      <Fragment>
        <div id="accordion">
          {
            exercises.length === 0
            ?
            <ListGroup style={{marginTop:10}}>
              <ListGroupItem>Chưa có bài tập</ListGroupItem>
            </ListGroup>
            :
            exercises.map((exercise,index) => 
              <Card className="mb-0" key={index} style={{marginTop:10}}>
                <CardHeader style={{backgroundColor: 'lightblue'}}>
                  <Row>
                    <Col xs="10">
                      <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[index]} aria-controls="collapseOne">
                        <h5 className="m-0 p-0" style={{color: 'black'}}>{exercise.title}</h5>
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
                <Collapse isOpen={this.state.accordion[index]} data-parent="#accordion" id="collapseOne">
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
                    {
                      role === 'student'
                      ?
                      <SubmitExercise exerciseId={exercise._id}/>
                      :
                      <Button block color="success" onClick={this.score.bind(this, exercise._id)} >Chấm điểm</Button>
                    }
                  </CardBody>
                  <CardFooter>
                    <ExerciseComments exercise={exercise}/>
                  </CardFooter>   
                </Collapse>
              </Card>
            )
          }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default  withRouter(connect(mapStateToProps, {  })(ExerciseList));  