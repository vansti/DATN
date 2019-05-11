import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Lesson extends Component {
  render() {
    return (
      <div className="animated fadeIn">

      </div>
    )
  }
}

Lesson.propTypes = {
};

const mapStateToProps = state => ({
});

export default withRouter(connect(mapStateToProps, {  })(Lesson));  