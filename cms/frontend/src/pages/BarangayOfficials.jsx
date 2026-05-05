import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import Breadcrumbs from "../components/Breadcrumbs";
import { useAuth } from "../components/AuthContext";
import cfg from "../../../server/config/domain";

const BarangayOfficials = () => {
  const { barangayId } = useAuth();
  const [barangayOfficials, setBarangayOfficials] = useState([]);
  const [SKOfficials, setSKOfficials] = useState([]);
  const [OtherOfficials, setOtherOfficials] = useState([]);

  useEffect(() => {
    if (barangayId) {
      fetchBarangayOfficials();
      fetchSKOfficials();
      fetchOtherOfficials();
    }
  }, [barangayId]);

  const fetchBarangayOfficials = async () => {
    try {
      const response = await axios.get(
        `http://${cfg.domainname}:${cfg.serverport}/official/` + barangayId,
        {
          withCredentials: true,
        }
      );
      if (response.status !== 200)
        throw new Error("Something went wrong with fetching data");
      setBarangayOfficials(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchSKOfficials = async () => {
    try {
      const response = await axios.get(
        `http://${cfg.domainname}:${cfg.serverport}/official/sk/` + barangayId,
        {
          withCredentials: true,
        }
      );
      if (response.status !== 200)
        throw new Error("Something went wrong with fetching data");
      setSKOfficials(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchOtherOfficials = async () => {
    try {
      const response = await axios.get(
        `http://${cfg.domainname}:${cfg.serverport}/official/others/` +
          barangayId,
        {
          withCredentials: true,
        }
      );
      if (response.status !== 200)
        throw new Error("Something went wrong with fetching data");
      setOtherOfficials(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  console.log("Barangay Officilas:", barangayOfficials);
  console.log("SK Officilas:", SKOfficials);
  console.log("Other Officilas:", OtherOfficials);

  const brgyCaptain = barangayOfficials.filter(
    (official) => official.cms_position === "Barangay Chairman"
  );
  const brgyCouncilors = barangayOfficials.filter(
    (official) =>
      official.cms_position === "Barangay Councilor" ||
      official.cms_position === "Barangay Treasurer" ||
      official.cms_position === "Barangay Secretary"
  );
  const SKCaptain = SKOfficials.filter(
    (official) => official.cms_position === "SK Chairman"
  );
  const SKCouncilors = SKOfficials.filter(
    (official) =>
      official.cms_position === "SK Councilor" ||
      official.cms_position === "SK Treasurer" ||
      official.cms_position === "SK Secretary"
  );

  return (
    <div className="flex-grow p-6 bg-gray-100">
      <Breadcrumbs />
      <div className="mx-auto bg-white p-10 rounded-lg">
        <div className="mb-10 leading-3 text-center">
          <h2 className="text-3xl text-gray-500 font-bold mb-2">
            Sangguniang Barangay Officials Organizational Chart
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            This is the barangay officials organizational chart, highlighting
            the Barangay Chairman at the top followed by other officials in the
            hierarchy.
          </p>
        </div>

        <div
          style={{
            //border: "1px solid blue",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          <div className="flex flex-wrap justify-center gap-3">
            {brgyCaptain.length > 0 ? (
              <div
                key={brgyCaptain[0].official_id}
                className="w-64 p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-md text-center"
              >
                <div className="mb-1">
                  {brgyCaptain[0].profile_image ? (
                    <img
                      src={`http://${cfg.domainname}:${cfg.serverport}${brgyCaptain[0].profile_image}`}
                      alt={`${brgyCaptain[0].full_name}'s profile`}
                      className="w-25 h-25 mx-auto rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600">No Image</span>
                    </div>
                  )}
                </div>
                <h3 className="text-l font-semibold">
                  {brgyCaptain[0].full_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {brgyCaptain[0].cms_position}
                </p>
                <p className="mt-2 text-xs text-gray-700">
                  Contact: {brgyCaptain[0].contact_number || "N/A"}
                </p>
              </div>
            ) : (
              <p className="text-gray-600">No barangay officials found.</p>
            )}
          </div>

          <div
            style={{
              //border: "1px solid blue",
              padding: "7px",
              borderRadius: "15px",
            }}
          ></div>

          <div className="flex flex-wrap justify-center gap-3">
            {brgyCouncilors.length > 0 ? (
              brgyCouncilors.map((official) => (
                <div
                  key={official.official_id}
                  className="w-64 p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-md text-center"
                >
                  <div className="mb-4">
                    {official.profile_image ? (
                      <img
                        src={`http://${cfg.domainname}:${cfg.serverport}${official.profile_image}`}
                        alt={`${official.full_name}'s profile`}
                        className="w-24 h-24 mx-auto rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">No Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold">
                    {official.full_name}
                  </h3>
                  <p className="text-gray-600">{official.cms_position}</p>
                  <p className="text-blue-600 text-sm">
                    {official.committee === "Secretary" ||
                    official.committee === "Treasurer"
                      ? null
                      : official.committee}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    Contact: {official.contact_number || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No barangay officials found.</p>
            )}
          </div>
        </div>

        <div
          style={{
            //border: "1px solid blue",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              //border: "1px solid blue",
              padding: "20px",
              borderRadius: "15px",
            }}
          ></div>

          <div className="mb-10 leading-3 text-center">
            <h2 className="text-3xl text-gray-500 font-bold mb-2">
              Sangguniang Kabataan Officials Organizational Chart
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              This is the sangguniang kabataan officials organizational chart,
              highlighting the SK Chairman at the top followed by other
              officials in the hierarchy.
            </p>
          </div>

          <div
            style={{
              //border: "1px solid blue",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            <div className="flex flex-wrap justify-center gap-3">
              {SKCaptain.length > 0 ? (
                <div
                  key={SKCaptain[0].official_id}
                  className="w-64 p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-md text-center"
                >
                  <div className="mb-1">
                    {SKCaptain[0].profile_image ? (
                      <img
                        src={`http://${cfg.domainname}:${cfg.serverport}${SKCaptain[0].profile_image}`}
                        alt={`${SKCaptain[0].full_name}'s profile`}
                        className="w-25 h-25 mx-auto rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">No Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-l font-semibold">
                    {SKCaptain[0].full_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {SKCaptain[0].cms_position}
                  </p>
                  <p className="mt-2 text-xs text-gray-700">
                    Contact: {SKCaptain[0].contact_number || "N/A"}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">No barangay officials found.</p>
              )}
            </div>

            <div
              style={{
                //border: "1px solid blue",
                padding: "7px",
                borderRadius: "15px",
              }}
            ></div>

            <div className="flex flex-wrap justify-center gap-3">
              {SKCouncilors.length > 0 ? (
                SKCouncilors.map((official) => (
                  <div
                    key={official.official_id}
                    className="w-64 p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-md text-center"
                  >
                    <div className="mb-4">
                      {official.profile_image ? (
                        <img
                          src={`http://${cfg.domainname}:${cfg.serverport}${official.profile_image}`}
                          alt={`${official.full_name}'s profile`}
                          className="w-24 h-24 mx-auto rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600">No Image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">
                      {official.full_name}
                    </h3>
                    <p className="text-gray-600">{official.cms_position}</p>
                    <p className="text-blue-600 text-sm">
                      {official.committee === "Secretary" ||
                      official.committee === "Treasurer"
                        ? null
                        : official.committee}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      Contact: {official.contact_number || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No barangay officials found.</p>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            //border: "1px solid blue",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              //border: "1px solid blue",
              padding: "20px",
              borderRadius: "15px",
            }}
          ></div>

          <div className="mb-10 leading-3 text-center">
            <h2 className="text-3xl text-gray-500 font-bold mb-2">
              Other Officials Organizational Chart
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              This is the barangay officials organizational chart other than
              Barangay and SK council.
            </p>
          </div>

          <div
            style={{
              //border: "1px solid blue",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                //border: "1px solid blue",
                padding: "7px",
                borderRadius: "15px",
              }}
            ></div>

            <div className="flex flex-wrap justify-center gap-3">
              {OtherOfficials.length > 0 ? (
                OtherOfficials.map((official) => (
                  <div
                    key={official.official_id}
                    className="w-64 p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-md text-center"
                  >
                    <div className="mb-4">
                      {official.profile_image ? (
                        <img
                          src={`http://${cfg.domainname}:${cfg.serverport}${official.profile_image}`}
                          alt={`${official.full_name}'s profile`}
                          className="w-24 h-24 mx-auto rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600">No Image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">
                      {official.full_name}
                    </h3>
                    <p className="text-gray-600">{official.cms_position}</p>
                    <p className="mt-2 text-sm text-gray-700">
                      Contact: {official.contact_number || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No barangay officials found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BarangayOfficials;
