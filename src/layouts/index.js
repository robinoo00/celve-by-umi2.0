import Footer from './footer'

function BasicLayout(props) {
  return (
    <div>
      { props.children }
      <Footer/>
    </div>
  );
}

export default BasicLayout;
