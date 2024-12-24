import Heading from "../custom/Heading";
import Section from "../custom/Section";
import PriceEstimator from "./PriceEstimator";

export default function PriceEstimatorTest() {
  return (
    <section>
      <Section
        id="price-estimator"
        className=" lg:justify-evenly justify-center gap-4"
      >
     
        <PriceEstimator/> 
      </Section>
      {/* <Section className="lg:flex-row-reverse flex-col max-h-screen lg:py-0 border-2 shadow-sm rounded-lg lg:px-0 lg:my-[5rem] lg:mx-[5rem] mx-[2rem] justify-between">
        <PieChartComponent />
        <BarGraph />
      </Section> */}
    </section>
  );
}
