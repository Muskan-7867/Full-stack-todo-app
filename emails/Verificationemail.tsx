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
  } from '@react-email/components';
  
  interface VerificationEmailProps {
    username: string;
    otp: string;
  }
  
  export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Verification Code</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Here&apos;s your verification code: {otp}</Preview>
        <Container style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
          <Section style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
            <Row>
              <Heading as="h2" style={{ fontSize: '20px', marginBottom: '20px' }}>Hello {username},</Heading>
            </Row>
            <Row>
              <Text style={{ fontSize: '16px', marginBottom: '10px' }}>
                Thank you for registering. Please use the following verification code to complete your registration:
              </Text>
            </Row>
            <Row>
              <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>{otp}</Text>
            </Row>
            <Row>
              <Text style={{ fontSize: '16px', color: '#555' }}>
                If you did not request this code, please ignore this email.
              </Text>
            </Row>
          </Section>
        </Container>
      </Html>
    );
  }
  