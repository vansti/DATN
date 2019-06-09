import React, { Component,Fragment } from 'react';
import { 
  ListGroupItem, 
  ListGroup 
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Exercise from './Exercise';

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
  }

  score(exerciseId){
    this.props.history.push(`/score/${this.props.match.params.id}/${exerciseId}`)
  }

  render() {
    const { exercises } = this.state;

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
              <Exercise exercise={exercise} index={index} key={index}></Exercise>
            )
          }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
});

export default  withRouter(connect(mapStateToProps, {  })(ExerciseList));  