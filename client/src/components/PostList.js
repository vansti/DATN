import React, { Component,Fragment } from 'react';
import {  Card, CardHeader, CardBody, Button, Collapse } from 'reactstrap';
import { connect } from 'react-redux';
import { getExerciseList } from '../actions/exerciseActions';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import isEmptyObj from '../validation/is-empty';

class PostList extends Component {
  constructor(props) {
    super(props);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.state = {
      accordion: [],
    };
  }

  componentDidMount = () => {
    var arr = {};
    arr.courseId = this.props.match.params.id
    this.props.getExerciseList(arr);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.exercises.exercises)) {
      const exercises = nextProps.exercises.exercises
      var accordion = [];
      exercises.map(()=>accordion.push(false))
      this.setState({accordion})
    }
  }


  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  render() {
    //console.log(this.props.exercises)
    return (
      <Fragment>
        <div id="accordion">
          <br/>
          <br/>
          <Card className="mb-0">
            <CardHeader id="headingOne">
              <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
                <h5 className="m-0 p-0">Collapsible Group Item #1</h5>
              </Button>
            </CardHeader>
            <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
              <CardBody>
                        1. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                        cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird
                        on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                        nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                        beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
              </CardBody>
            </Collapse>
          </Card>
          <Card className="mb-0">
            <CardHeader id="headingOne">
              <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)} aria-expanded={this.state.accordion[1]} aria-controls="collapseOne">
                <h5 className="m-0 p-0">Collapsible Group Item #1</h5>
              </Button>
            </CardHeader>
            <Collapse isOpen={this.state.accordion[1]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
              <CardBody>
                        1. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                        cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird
                        on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                        nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                        beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
              </CardBody>
            </Collapse>
          </Card>
          <Card className="mb-0">
            <CardHeader id="headingOne">
              <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(2)} aria-expanded={this.state.accordion[2]} aria-controls="collapseOne">
                <h5 className="m-0 p-0">Collapsible Group Item #1</h5>
              </Button>
            </CardHeader>
            <Collapse isOpen={this.state.accordion[2]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
              <CardBody>
                        1. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                        cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird
                        on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                        nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                        beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
              </CardBody>
            </Collapse>
          </Card>
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