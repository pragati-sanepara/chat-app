'use client'

import Link from "next/link";
import React from "react";

export default function Services() {
    const [servicesList, setServicesList] = React.useState([
        { 
            "id": 1,
            "name": "Web Development",
            "details": "Designing and creating websites and web applications.",
            "more_fields": {
                "strategies": ["Web", "Mobile"],
                "tools": ["HTML", "CSS", "JavaScript", "React", "Node.js"]
            }
        },
        {
            "id": 2,
            "name": "Mobile App Development",
            "details": "Developing applications for mobile devices.",
            "more_fields": {
                "strategies": ["iOS", "Android"],
                "tools": ["Java", "Kotlin", "Swift", "React Native"]
            }
        },
        {
            "id": 3,
            "name": "Graphic Design",
            "details": "Creating visual content to communicate messages.",
            "more_fields": {
                "strategies": ["Logo Design", "Illustration", "UI/UX Design"],
                "tools": ["Adobe Photoshop", "Adobe Illustrator", "Sketch"]
            }
        },
        {
            "id": 4,
            "name": "Digital Marketing",
            "details": "Promoting products or services using digital channels.",
            "more_fields": {
                "strategies": ["SEO", "Social Media Marketing", "Email Marketing"],
                "tools": ["Google Analytics", "Facebook Ads Manager", "MailChimp"]
            }
        }
    ]);

    return (
        <main className="flex flex-col items-center justify-between p-20">
            Services List

            <div className="pt-12 relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Details
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Specialties
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tools
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicesList.map((service: any) => {
                            return <>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {service.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {service.details}
                                    </td>
                                    <td className="px-6 py-4">
                                        {service.more_fields.strategies}
                                    </td>
                                    <td className="px-6 py-4">
                                        {service.more_fields.tools}
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <Link href={`/dashboard/services/${service.id}`}>
                                            <img src="../../assets/info.svg" alt="view"/>
                                        </Link>
                                        <Link href={`/dashboard/services/edit/${service.id}`}>
                                            <img src="../../assets/edit.svg" alt="edit"/>
                                        </Link>
                                    </td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table>
            </div>
        </main>
    );
}