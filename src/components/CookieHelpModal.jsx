import React from "react";
import {
    Chrome,
    Globe,
    ShieldAlert,
    RefreshCcw,
    XCircle,
    Compass
} from "lucide-react";

function CookieHelpModal({ onRetry, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[420px] rounded-xl shadow-2xl p-6">

                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="text-orange-500" size={22} />
                    <h2 className="text-lg font-semibold">
                        Cookies Required to Stay Logged In
                    </h2>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    Your login was successful, but your browser blocked cookies required to
                    keep you signed in.
                    You can allow cookies <b>only for this site</b>.
                </p>

                {/* Browser Steps */}
                <div className="space-y-4 text-sm text-gray-700">

                    {/* Chrome / Edge */}
                    <div className="flex gap-3">
                        <Chrome className="text-blue-600 mt-1" size={18} />
                        <div>
                            <p className="font-medium">Chrome / Edge</p>
                            <ol className="list-decimal ml-4 text-gray-600">
                                <li>Open Settings → Privacy & Security</li>
                                <li>Cookies and other site data</li>
                                <li>Add this site under <b>“Always allow cookies”</b></li>
                                <li>Enable <b>“Including third-party cookies”</b></li>
                            </ol>
                        </div>
                    </div>

                    {/* Firefox */}
                    <div className="flex gap-3">
                        <Globe className="text-orange-600 mt-1" size={19} />
                        <div>
                            <p className="font-medium">Firefox</p>
                            <p className="text-gray-600">
                                Set <b>Enhanced Tracking Protection</b> to <b>Standard</b> for this site.
                            </p>
                        </div>
                    </div>

                    {/* Safari */}
                    <div className="flex gap-3">
                        <Compass className="text-gray-800 mt-1" size={27} />
                        <div>
                            <p className="font-medium">Safari</p>
                            <p className="text-gray-600">
                                Safari restricts cross-site cookies by default.
                                If login fails, please use Chrome or Edge.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1 px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
                    >
                        <XCircle size={16} />
                        Close
                    </button>

                    <button
                        onClick={onRetry}
                        className="flex items-center gap-1 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800"
                    >
                        <RefreshCcw size={16} />
                        Retry Login
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CookieHelpModal;
