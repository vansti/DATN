import React, { Component } from 'react';
import './New.css';

class New extends Component {
  // constructor(props){
    // super(props);
    // this.state = {};
  // }

  // componentWillMount(){}
  // componentDidMount(){}
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {
    return (
      <div>
        <div class="news">
          <div class="container">
            <div class="row">
              <div class="col">
                <div class="section_title_container text-center">
                  <h2 class="section_title">Latest News</h2>
                  <div class="section_subtitle"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel gravida arcu. Vestibulum feugiat, sapien ultrices fermentum congue, quam velit venenatis sem</p></div>
                </div>
              </div>
            </div>
            <div class="row news_row">
              <div class="col-lg-7 news_col">
                <div class="news_post_large_container">
                  <div class="news_post_large">
                    <div class="news_post_image"><img src="images/news_1.jpg" alt=""></img></div>
                    <div class="news_post_large_title"><a href="blog_single.html">Here’s What You Need to Know About Online Testing for the ACT and SAT</a></div>
                    <div class="news_post_meta">
                      <ul>
                        <li><a href="#">admin</a></li>
                        <li><a href="#">november 11, 2017</a></li>
                      </ul>
                    </div>
                    <div class="news_post_text">
                      <p>Policy analysts generally agree on a need for reform, but not on which path policymakers should take. Can America learn anything from other nations...</p>
                    </div>
                    <div class="news_post_link"><a href="blog_single.html">read more</a></div>
                  </div>
                </div>
              </div>

              <div class="col-lg-5 news_col">
                <div class="news_posts_small">
                  <div class="news_post_small">
                    <div class="news_post_small_title"><a href="blog_single.html">Home-based business insurance issue (Spring 2017 - 2018)</a></div>
                    <div class="news_post_meta">
                      <ul>
                        <li><a href="#">admin</a></li>
                        <li><a href="#">november 11, 2017</a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="news_post_small">
                    <div class="news_post_small_title"><a href="blog_single.html">2018 Fall Issue: Credit Card Comparison Site Survey (Summer 2018)</a></div>
                    <div class="news_post_meta">
                      <ul>
                        <li><a href="#">admin</a></li>
                        <li><a href="#">november 11, 2017</a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="news_post_small">
                    <div class="news_post_small_title"><a href="blog_single.html">Cuentas de cheques gratuitas una encuesta de Consumer Action</a></div>
                    <div class="news_post_meta">
                      <ul>
                        <li><a href="#">admin</a></li>
                        <li><a href="#">november 11, 2017</a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="news_post_small">
                    <div class="news_post_small_title"><a href="blog_single.html">Troubled borrowers have fewer repayment or forgiveness options</a></div>
                    <div class="news_post_meta">
                      <ul>
                        <li><a href="#">admin</a></li>
                        <li><a href="#">november 11, 2017</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="newsletter">
          <div class="newsletter_background parallax-window" data-parallax="scroll" data-image-src="images/newsletter.jpg" data-speed="0.8"></div>
          <div class="container">
            <div class="row">
              <div class="col">
                <div class="newsletter_container d-flex flex-lg-row flex-column align-items-center justify-content-start">
                  <div class="newsletter_content text-lg-left text-center">
                    <div class="newsletter_title">sign up for news and offers</div>
                    <div class="newsletter_subtitle">Subcribe to lastest smartphones news & great deals we offer</div>
                  </div>
                  <div class="newsletter_form_container ml-lg-auto">
                    <form action="#" id="newsletter_form" class="newsletter_form d-flex flex-row align-items-center justify-content-center">
                      <input type="email" class="newsletter_input" placeholder="Your Email" required="required"></input>
                      <button type="submit" class="newsletter_button">subscribe</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default New;