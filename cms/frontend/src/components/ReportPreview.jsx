import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer';
import barangayLogo from '../assets/ph_logos/brgy_5628.png';

// Register fonts
Font.register({
    family: 'Arimo',
    fonts: [
        {
            src: 'https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh50Xew-FGC_p9dw.ttf',
            fontWeight: 'bold'
        },
        {
            src: 'https://fonts.gstatic.com/s/lato/v24/S6u8w4BMUTPHjxswWyWrFCbw7A.ttf',
            fontWeight: 'normal'
        },
        {
            src: 'https://fonts.gstatic.com/s/opensans/v40/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0RkyFjaVcUwaERZjA.ttf',
            fontWeight: 'thin'
        }
    ]
});

Font.register({
    family: 'Open Sans',
    fonts: [
        {
            src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObjwSVZyOOSr4dVJWUgshZ1y4nY1M2xLER.ttf',
            fontWeight: 'bold'
        }
    ]
});

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Arimo',
        position: 'relative'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottom: 1,
        paddingBottom: 20
    },
    headerImage: {
        width: 60,
        height: 60
    },
    headerTextContainer: {
        marginHorizontal: 20,
        alignItems: 'center'
    },
    headerText: {
        fontSize: 8,
        marginBottom: 2,
        fontFamily: 'Arimo',
        fontWeight: 'normal'
    },
    barangayName: {
        fontSize: 16,
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        marginVertical: 5
    },
    officeTitle: {
        fontSize: 9,
        fontFamily: 'Arimo',
        fontWeight: 'thin'
    },
    title: {
        fontSize: 16,
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    content: {
        marginVertical: 10
    },
    toWhom: {
        fontSize: 12,
        fontFamily: 'Arimo',
        fontWeight: 'bold',
        marginBottom: 10
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        marginVertical: 10
    },
    tableRow: {
        flexDirection: 'row'
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
        fontFamily: 'Open Sans',
        padding: 5,
        fontSize: 12,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        textAlign: 'center'
    },
    tableCell: {
        padding: 3,
        borderStyle: 'solid',
        borderWidth: 1,
        fontSize: 10,
        borderColor: '#000',
        textAlign: 'center',
        fontFamily: 'Arimo',
        fontWeight: 'normal'
    },
    signatureContainer: {
        marginTop: 80,
        alignItems: 'flex-end',
        paddingRight: 50
    },
    signatureLine: {
        borderBottom: 1,
        width: 200
    },
    signatureText: {
        fontSize: 12,
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'center'
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 55,
        width: '80%',
        fontSize: 10,
        fontFamily: 'Arimo',
        fontWeight: 'normal',
        textAlign: 'center'
    }
});

const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

const ReportPreview = ({ data }) => (
    <Document Document >
        <Page size="A4" style={styles.page}>
            {/* Header Section */}
            <View style={styles.header}>
                <Image
                    style={styles.headerImage}
                    src={barangayLogo}
                />
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Republic of the Philippines</Text>
                    <Text style={styles.headerText}>Province of Bataan</Text>
                    <Text style={styles.headerText}>Municipality of Dinalupihan</Text>
                    <Text style={styles.barangayName}>BARANGAY COLO</Text>
                    <Text style={styles.officeTitle}>Office of the Punong Barangay</Text>
                </View>
                <Image
                    style={styles.headerImage}
                    src={barangayLogo}
                />
            </View>

            {/* Document Title */}
            <Text style={styles.title}>REPORT</Text>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.toWhom}>TO WHOM IT MAY CONCERN:</Text>

                {/* Table */}
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableHeader, { width: '20%' }]}>Id</Text>
                        <Text style={[styles.tableHeader, { width: '20%' }]}>Full Name</Text>
                        <Text style={[styles.tableHeader, { width: '20%' }]}>Address</Text>
                        <Text style={[styles.tableHeader, { width: '20%' }]}>Gender</Text>
                        <Text style={[styles.tableHeader, { width: '20%' }]}>Number</Text>
                    </View>

                    {/* Table Rows */}
                    {
                        data?.map((resident, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { width: '20%' }]}>{resident.resident_id}</Text>
                                <Text style={[styles.tableCell, { width: '20%' }]}>{
                                    `${resident.first_name} ${resident.last_name}`
                                }</Text>
                                <Text style={[styles.tableCell, { width: '20%' }]}>{`${resident.address} ${resident.barangay}, ${resident.city}`}</Text>
                                <Text style={[styles.tableCell, { width: '20%' }]}>{resident.gender}</Text>
                                <Text style={[styles.tableCell, { width: '20%' }]}>{resident.contact_number}</Text>
                            </View>
                        ))
                    }
                </View>
            </View>

            {/* Signature Section */}
            <View style={styles.signatureContainer}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>Punong Barangay</Text>
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    This document is system-generated and does not require a physical signature. Generated on {currentDate}. For verification or further inquiries, please contact the Barangay Colo office.
                </Text>
            </View>
        </Page>
    </Document >
);

export default ReportPreview;
