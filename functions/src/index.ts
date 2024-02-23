import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import st from "stripe";

const stripe = new st(
  "sk_test_51MyR7yHMk6dSdO1wC3Ypxlvj0S1uTm1027sHkWR60tUoYsaP0F5VCIi5ntYPFIoqs6Im4mWd6JxHqD2nGcSJlgcM00R6LDmJpA"
);

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "adverts-95edd",
    private_key_id: "661f0e9d45d404037c50d46f4c163e925c7c2fd7",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1xLee/H1X6iyr\nEHFkgsBJuuP4cbkTaf81runUYWNdkfAVprWYmixmMjhlc7BzOptsfCR8Iw45GzXS\n5b+lvppVw1TSDuTfR5B1xDpv31Hefg+zIgvP6b4AqEVI38GGXDxrAuL5rubS/Dhn\nb3WloQYwMm5w8JVS7V/7tJimNZDs7kLcpvffyURZyB2VdQT5SvhAGfK/9nBM0qZk\nY7Sc21YB84cjPDFtUZ+DABoqCeO/UZDm6p7wk+gA9aczOVzO4hWhOCvwmxYhMttx\nuTuRXMGSLlYzcAYLCP99i5wiUsH+a2jYmIpL/EfnXPa3HGVhqv+/A1xfpwgvzr4O\nYVIF5C+zAgMBAAECggEAA4Q04cKmth7VyYe0nnNPY5SfAdi3Fpl9W3QVh/kC64gQ\nPEHZz4Qa5TaqphGDUadcLGL2cARb4jmCrcUXN+nJD20diWSBOm24tnDR0k7OIIOj\nhvjtNwChnxVZJTegF4ifRXWQ+tRzPUsbjxgj6qg6rtjffTy1skFvXBI6fKJjzF0D\nRMN2OSZKM2ZtcREDDgZouVwq3u0QPMXWIDIoaWncYFVWArcacPhbkWv6fyo7SFn2\ntwzIjkBH0y/XD6sSpCaWyr+8c10wLsVnox97OMoivNQoq55z+VwhaYxn2B5qRTi1\n5KHFFnFEue8Dyj23A8Inbi92tBK/XNC5oHtsBdqRsQKBgQDpdixscN8PFkU+fb8N\nLZibn5j0WGDHhjJL86Xd5+RpSZdSlHcif0AZK5MAqbo9n2MGP4abfSzjqrgelkUZ\n54+zmV89ybnQBN75u4AYJEoFkoTTsaAGA0oxNkf1VjycnwLei9on8Kv7cjW9sa6m\nT4BVRoPKqpWNtHQ/Y4dwjnvh2QKBgQDHUPxhBd928ugXh3r78SFoh2bXpZYAUyxq\npREizNnVZyllumsPFpQkV3XFA42pd+rOo5GrF2QPNCBoYIaHp2mOnVTO8zvS0zsi\n/zwnuhqW0xaslEb7TwAZbUo8SCeMKdFtNmYsxwHG81+zEhrozP2v6VyS3jnGB2Ds\nq2Oof9raawKBgH3w7AIL2ajv4KbXeusG/95j+EVIL90yvYtPgtj0sblCo8k+og4Q\nC2oIoaKn7Po1M1w5hMn4evDONcj6U4in7FN8l25jlkNrfUXHKlDbsrrS0ajJl4Pm\n3m0x1Ru6S7RJ62hWlXcaVAyvDeKpKYg6NwbJpWr9HvR0tolDjdrgYl/xAoGAH1Gw\ndqZvmMdOhPP69T/Mmho8pMIWMfLf1doeOTOrPwc40A1c6UAJAzTjApQuXGTFdrbp\nGtNQG7t7JCuWuBYsVgaO3v4FdnlOn48vqqZpqy18MJ4UEUU2pMgxlAtae4HOsLSN\nlZenxdVUQlUj+VTMwCmRLFrTBTT/m/DKdh2xDAUCgYAnrq+ouUD02PMcvTrg/UbG\nYPrOQwiF7h6LAQsVqPTwfX6ZrMwYjOJWyQV4wy6iZf2HW6j7TETb9iveZkb71SHj\nxsvH1OM86zl2fys4HuPm3OBC4D2pBogODms3Es9pCndWoKPk3gPrpB4jd9SWLO/K\n/rIto2ertIJTCyY1d9nYeA==\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-zg8xf@adverts-95edd.iam.gserviceaccount.com",
    client_id: "113841000288813286773",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zg8xf%40adverts-95edd.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  } as admin.ServiceAccount),
});

export const stripeWebhook = onRequest(async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature as any,
      "whsec_t80AcbJNZgmOx4uiTTuxj0GDaQHEJ3D2"
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await admin
          .firestore()
          .collection("users")
          .doc(session?.client_reference_id as string)
          .set(
            {
              package: "premium",
            },
            {
              merge: true,
            }
          );
        console.log('Updated user plan to "pro"');
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );
        // get user by email and update plan to freemium
        const userSnapshot = await admin
          .firestore()
          .collection("users")
          // eslint-disable-next-line
          // @ts-ignore
          .where("email", "==", customer?.email)
          .get();
        userSnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          admin.firestore().collection("users").doc(doc.id).set(
            {
              package: "freemium",
            },
            {
              merge: true,
            }
          );
          console.log(
            'Updated user plan to "freemium" (subscription canceled)'
          );
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscriptionUpdate = event.data.object;
        const customerUpdate = await stripe.customers.retrieve(
          subscriptionUpdate?.customer as string
        );
        if (
          subscriptionUpdate?.cancellation_details?.reason ===
          "cancellation_requested"
        ) {
          // get user by email and update plan to freemium
          const userSnapshot = await admin
            .firestore()
            .collection("users")
            // eslint-disable-next-line
            // @ts-ignore
            .where("email", "==", customerUpdate.email)
            .get();
          userSnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            admin.firestore().collection("users").doc(doc.id).set(
              {
                package: "freemium",
              },
              {
                merge: true,
              }
            );
            console.log(
              'Updated user plan to "freemium" (subscription canceled)'
            );
          });
          break;
        }
        // get user by email and update plan to freemium
        const updatedUserSnapshot = await admin
          .firestore()
          .collection("users") // eslint-disable-next-line
          // @ts-ignore
          .where("email", "==", customerUpdate.email)
          .get();
        updatedUserSnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          admin.firestore().collection("users").doc(doc.id).set(
            {
              package: "premium",
            },
            {
              merge: true,
            }
          );
          console.log('Updated user plan to "pro" (subscription updated)');
        });
        break;
      }

      // Add other webhook event handling logic here...

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ result: event, ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", ok: false });
  }
});
