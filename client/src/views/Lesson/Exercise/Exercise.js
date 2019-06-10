import React, { Component,Fragment } from 'react';
import { 
  Card, CardHeader, 
  CardBody, Button, 
  Collapse, ListGroupItem, 
  Row, Col, CardFooter, 
  ListGroup, FormGroup, Input, Label
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Moment from 'react-moment'; 
import ExerciseComments from './ExerciseComments';
import SubmitExercise from './SubmitExercise';
import isEmptyObj from '../../../validation/is-empty';

import NoImg from '../../../assets/img/NoImg.png';

class Exercise extends Component {
  constructor(props) {
    super(props);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.state = {
      accordion: false,
      exercises: '',
      wrongPassword: true,
      password: ''
    };
  }

  toggleAccordion() {
    const prevState = this.state.accordion;
    const state = prevState ? false : true;
    this.setState({
      accordion: state,
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  score(exerciseId){
    this.props.history.push(`/score/${this.props.match.params.id}/${exerciseId}`)
  }

  checkPassword = () => {
    if(this.state.password === this.props.exercise.password) {
      this.setState({
        wrongPassword: false
      })
    }
  }

  render() {
    const { exercise, index } = this.props;
    const { role } = this.props.auth.user;
    return (
      <Fragment>
      {
        this.state.wrongPassword && !isEmptyObj(exercise.password)
        ?
        <Card className="mb-0" key={index} style={{marginTop:10}}>
          <CardHeader style={{backgroundColor: 'lightblue'}}>
            <Row>
              <Col xs="10">
                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion()} aria-expanded={this.state.accordion} aria-controls="collapseOne">
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
          <Collapse isOpen={this.state.accordion} data-parent="#accordion" id="collapseOne">
            <CardBody>
              <FormGroup row>
              <Col md="2">
                <Label style={{marginTop: 10}}>Hãy điền mật khẩu: </Label>
              </Col>
              <Col md="4">
                <Input name="password" type="text" onChange={this.onChange}  placeholder="Mật khẩu..."/>
              </Col>
              <Col md="3">
                <Button block color="primary" onClick={this.checkPassword} >Xác nhận</Button>
              </Col>
            </FormGroup>
            </CardBody>
          </Collapse>
        </Card>
        :
        <Card className="mb-0" key={index} style={{marginTop:10}}>
          <CardHeader style={{backgroundColor: 'lightblue'}}>
            <Row>
              <Col xs="10">
                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion()} aria-expanded={this.state.accordion} aria-controls="collapseOne">
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
          <Collapse isOpen={this.state.accordion} data-parent="#accordion" id="collapseOne">
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
                <SubmitExercise exercise={exercise}  />
                :
                null
            }
            </CardBody>
            <CardFooter>
            <ExerciseComments exercise={exercise}/>
            </CardFooter>   
          </Collapse>
        </Card>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default  withRouter(connect(mapStateToProps, {  })(Exercise));  