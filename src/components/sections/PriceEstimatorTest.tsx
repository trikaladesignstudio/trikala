import Heading from "../custom/Heading";
import Section from "../custom/Section";
import PriceEstimator from "./PriceEstimator";

export default function PriceEstimatorTest() {
  return (
    <section>
      <Section
        id="price-estimator"
        className=" lg:justify-start items-center justify-center "
      >
        <PriceEstimator />
      </Section>
    </section>
  );
}
