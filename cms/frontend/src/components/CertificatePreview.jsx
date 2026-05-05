import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import CooperBlack from '../../src/assets/fonts/COOPBL.woff';
import TimesRomanBold from '../../src/assets/fonts/timesbd.ttf';
import TimesRoman from '../../src/assets/fonts/times.ttf';
import Calibri from '../../src/assets/fonts/calibri.ttf';
import Calistoga from '../../src/assets/fonts/Calistoga-Regular.ttf';
import Arial from '../../src/assets/fonts/arial.ttf';
//import certificateTemplate from "../assets/templates/ColoCertificateTemplate.jpg";

Font.registerHyphenationCallback(word => [word]);

Font.register({
    family: "Arimo",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh50Xew-FGC_p9dw.ttf",
        fontWeight: "bold",
      },
      {
        src: "https://fonts.gstatic.com/s/lato/v24/S6u8w4BMUTPHjxswWyWrFCbw7A.ttf",
        fontWeight: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/opensans/v40/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0RkyFjaVcUwaERZjA.ttf",
        fontWeight: "thin",
      },
    ],
  });

  Font.register({
    family: "Open Sans",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObjwSVZyOOSr4dVJWUgshZ1y4nY1M2xLER.ttf",
        fontWeight: "bold",
      },
    ],
  });

  Font.register({
    family: "Cooper Black",
    src: CooperBlack,
  });

  Font.register({
    family: "Times New Roman Bold",
    src: TimesRomanBold,
  });

  Font.register({
    family: "Times New Roman",
    src: TimesRoman,
  });

  Font.register({
    family: "Calibri",
    src: Calibri,
  });

  Font.register({
    family: "Calistoga",
    src: Calistoga,
  });

    Font.register({
    family: "Arial",
    src: Arial,
  });

const CertificatePreview = ({
  message,
  brgyOfficials,
  certificateTypeId,
  certificateTitle,
  certificateTemplate,
  applicant_image,
  controlnumber,
  date,
}) => {
  const withProfilePic = [6,8,11,17].includes(certificateTypeId);
  const withThumbmak = [17].includes(certificateTypeId);

  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      width: "100%",
      height: "100%",
      fontFamily: "Times New Roman Bold",
    },
    backgroundImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    title: {
      position: "absolute",
      top: 190,
      left: 35,
      right: 0,
      fontSize: 16,
      //fontWeight: "800",
      fontWeight: "bold",
      textAlign: "center",
      justifyContent: 'center',
      marginBottom: 20,
      //fontFamily: "Arimo",
      fontFamily: "Times New Roman Bold"
    },
    content: {
      flexDirection: "row",
      justifyContent: "space-between",
      //paddingHorizontal: 10,
      //marginTop: 200,
      top: 115,
      position: "absolute",
      width: "100%",
      height: "80%",
    },
    //officialsSection: {
    //  flexDirection: "column",
    //  alignItems: "center",
    //  marginTop: -30,
    //  width: "30%",
    //},
    //sangguniangBarangayText: {
    //  fontSize: 10,
    //  fontWeight: "bold",
    //  fontFamily: "Arimo",
    //  color: "#7b0d16",
    //  marginBottom: 10,
    //},
    //officialItem: {
    //  marginTop: 5,
    //  marginBottom: 7,
    //  flexDirection: "column",
    //  alignItems: "center",
    //},
    //firstOfficialName: {
    //  fontSize: 14,
    //  fontWeight: "bold",
    //  //fontFamily: "Open Sans",
    //  fontFamily: "Calistoga",
    //  color: "#000000ff",
    //},
    //additionalOfficialName: {
    //  fontSize: 12,
    //  fontWeight: "bold",
    //  //fontFamily: "Open Sans",
    //  fontFamily: "Calistoga",
    //  color: "#000000ff",
    //},
    //CaptainPosition: {
    //  fontSize: 10,
    //  color: "#18b7fbff",
    //  flexDirection: "column",
    //  alignItems: "center",
    //  textAlign: "center",
    //  fontFamily: "Arial",
    //  fontWeight: "bold",
    //},
    //officialPosition: {
    //  fontSize: 8,
    //  color: "#18b7fbff",
    //  flexDirection: "column",
    //  alignItems: "center",
    //  textAlign: "center",
    //  fontFamily: "Arial",
    //  fontWeight: "bold",
    //},
    //mgaKagawadText: {
    //  fontSize: 10,
    //  marginTop: 3,
    //  fontWeight: "bold",
    //  color: "#7b0d16",
    //  fontFamily: "Arimo",
    //},
    messageSection: {
      width: "70%",
      fontSize: 12,
      textAlign: "justify",
      lineHeight: 2,
      //marginTop: "40px",
      //marginLeft: "auto",
      //marginRight: "auto",
      flexDirection: "column",
      alignItems: "flex-end",
      textIndent: 4,
      position: "absolute",
      top: 115, 
      left: 80,
      right: 70,
      fontFamily: "Times New Roman"
    },
    dateText: {
      fontSize: 13,
      textAlign: "right",
      marginBottom: 10,
    },
    messageText: {
      fontFamily: "Times New Roman",
      fontSize: 12,
      textIndent: 4,
      textAlign: "left",
    },
    esignature_img: {
      width: 125
      ,
    },
    signature_bold: {
      position: "absolute",
      left: 235,
      bottom: 20,
      width: 150,
      fontSize: 12,
      textAlign: 'center',
      fontFamily: "Times New Roman Bold",
      color: "#000000ff"
    },
    signature_right: {
      position: "absolute",
      left: 350,
      bottom: 85,
      width: 150,
      fontSize: 12,
      textAlign: 'center',
      fontFamily: "Times New Roman Bold",
      color: "#000000ff"
    },
    official_title: {
      position: "absolute",
      left: 405,
      bottom: -10,
      width: 150,
      fontSize: 12,
      textAlign: 'center',
      fontFamily: "Times New Roman",
      color: "#000000ff"
    },
    controlNumber: {
      position: "absolute",
      left: 440,
      bottom: 0,
      width: 150,
      fontSize: 11,
      fontFamily: 'Arimo',
      color: "#000000ff",
      fontWeight: 'bold',
    },
    profilepic: {
      position: "absolute",
      left: 110,
      bottom: 110,
      width: 110,
      border: '0.5px solid black'
    },
    reqsignature: {
      position: "absolute",
      left: 100,
      bottom: 75,
      width: 125,
      fontSize: 11,
      textAlign: 'center',
      fontFamily: "Times New Roman",
    },
    thumbSection: {
      position: "absolute",
      bottom: 85,
      left: 420,
      width: 100,
      height: 100,
      alignItems: "center",
    },
    thumbBox: {
      width: 80,
      height: 100,
      borderWidth: 1,
      borderColor: "black",
      marginBottom: 6,
    },
    thumbLabel: {
      fontSize: 11,
      fontFamily: "Times New Roman"
   }

  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={certificateTemplate} style={styles.backgroundImage} fixed />

        <Text style={styles.title}>{certificateTitle}</Text>

        <View style={styles.content}>
          <View style={[styles.messageSection, styles.indent]}>
            <Text style={styles.dateText}></Text>
            <Text style={[styles.messageText, styles.indent]}>
              {message.map((part, index) => (
                <Text
                key={index}
                style={
                  part.isBold
                    ? {
                        fontWeight: "bold",
                        fontFamily: "Times New Roman Bold",
                        fontSize: 14,
                      }
                    : {
                        fontSize: 14,
                      }
                }
                 >
                   {(part.text ?? "").toString().split("").map((char, i) => (
                    <Text
                      key={i}
                      style={{
                        color: char === "_" ? "transparent" : "black",
                      }}
                    >
                      {char}
                    </Text>
                  ))}
                </Text>
              ))}
            </Text>
          </View>
          {withProfilePic && (
          <View style={styles.profilepic}>
            <Image src={"/src/assets" + applicant_image} fixed />
          </View>
           )}
           {withProfilePic && (
          <View style={styles.reqsignature}>
            <Text>______________________</Text>
            <Text>SIGNATURE</Text>
          </View>
          )}
          {withThumbmak ? (
          <View style={styles.signature_bold}>
            <Image src={"/src/assets" + brgyOfficials[0].e_signature} 
                   style={styles.image} fixed />
            <Text>{brgyOfficials[0].full_name}</Text>
            <Text style={{fontFamily: 'Times New Roman'}}>Punong Barangay</Text>
          </View>
          ) : (
          <View style={styles.signature_right}>
            <Image src={"/src/assets" + brgyOfficials[0].e_signature} 
                   style={styles.image} fixed />
            <Text>{brgyOfficials[0].full_name}</Text>
            <Text style={{fontFamily: 'Times New Roman'}}>Punong Barangay</Text>
          </View>
          )
          }
          <View style={styles.controlNumber}>
            <Text style={styles.messageText}>CTRL.NO.: {controlnumber}</Text>
          </View>
          {withThumbmak && (
          <View style={styles.thumbSection}>
          <View style={styles.thumbBox} />
            <Text style={styles.thumbLabel}>Right Thumbmark</Text>
          </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default CertificatePreview;
