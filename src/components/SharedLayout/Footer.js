import React from 'react'

const Footer = () => {
  return (
    <footer className="footer container-fluid bg-dark" style={{marginTop :"100%" }}>
    <div class="footer-warpper">
     
       <div class="footer-top">
          <div class="container">
             <div class="footer-bottom-content clearfix">
                <div class="row">
                   <div class="col-lg-4 col-md-4">
                     

                  

                      <ul class="footer-social-list list-social list-inline">
                         <li>
                            <a href="https://www.facebook.com/evangaditech" target="_blank">
                            <i class="social_facebook "></i>
                            </a>
                         </li>
                         <li>
                            <a href="https://www.instagram.com/evangaditech/" target="_blank">
                            <i class="social_instagram "></i>
                            </a>
                         </li>
                         <li>
                            <a href="https://www.youtube.com/@EvangadiTech" target="_blank">
                            <i class="social_youtube "></i>
                            </a>
                         </li>
                      </ul>
                   </div>
                   <div class="col-lg-4 col-md-4">
                      <h5>Useful Link</h5>
                      <ul class="list-menu">
                         <li>
                            <a href="/legal/terms/">Terms of Service</a>
                         </li>
                         <li>
                            <a href="/legal/privacy/">Privacy policy</a>
                         </li>
                      </ul>
                   </div>
                   <div class="col-lg-4 col-md-4">
                      <h5>Contact Info</h5>
                      <ul class="list-menu contact-list">
                         <li>
                           support@evangadi.com
                         </li>
                         <li>+1-202-386-2702</li>
                      </ul>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
 </footer>
  )
}

export default Footer