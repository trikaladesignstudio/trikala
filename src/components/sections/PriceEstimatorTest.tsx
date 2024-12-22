import Section from "../custom/Section";
import Heading from "../custom/Heading";
import PriceForm from "../custom/PriceForm";

export default function PriceEstimatorTest() {
  return (
    <Section
      id="price-estimator"
      className="border-2 border-black lg:justify-evenly justify-center gap-4"
    >
      <Heading className="text-center border w-full" text="Interior Price Estimator" />
      <PriceForm />
    </Section>
  );
}
