import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Container,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({
  username,
  otp,
}) => {
  // Create a verification link that directs to the verification page

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here's your verification code: {otp}</Preview>
      <Container className="p-5 bg-gray-100">
        <Section className="bg-white p-5 rounded-lg">
          <Row>
            <Heading as="h2" className="text-xl mb-5">
              Hello {username},
            </Heading>
          </Row>
          <Row>
            <Text className="text-base mb-3">
              Thank you for registering. Please use the following verification
              code to complete your registration:
            </Text>
          </Row>
          <Row>
            <Text className="text-lg font-bold mb-5">{otp}</Text>
          </Row>
          <Row>
            <Text className="text-base mb-5">
              Or click the button below to verify your email:
            </Text>
          </Row>
          <Row className="text-center mb-5">
            <Button className="bg-black text-white no-underline font-bold rounded px-6 py-3 inline-block">
              Verify Your Email
            </Button>
          </Row>
          <Row>
            <Text className="text-base text-gray-500">
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
        </Section>
      </Container>
    </Html>
  );
};

export default VerificationEmail;
