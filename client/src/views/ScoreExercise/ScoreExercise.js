import React, { Component } from 'react';
//import { Button} from 'reactstrap';
import { getExercise } from '../../actions/exerciseActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ScoreExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
          title:''
        };
    }

    componentDidMount(){
        this.props.getExercise(this.props.match.params.exerciseId)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.exercises) {
            this.setState({
                title: nextProps.exercises.exercise.title
            })
        }
    }

    render() {
        return (
        <div className="animated fadeIn">
            {this.state.title}

        </div>
        )
    }
}

ScoreExercise.propTypes = {
    getExercise: PropTypes.func.isRequired,
    exercises: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    exercises: state.exercises
});

export default connect(mapStateToProps, {getExercise})(ScoreExercise); 
