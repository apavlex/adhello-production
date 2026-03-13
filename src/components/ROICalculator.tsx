import React, { useState } from 'react';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export function ROICalculator() {
    const [averageCustomerValue, setAverageCustomerValue] = useState(1500);
    const [expectedNewCustomersMonthly, setExpectedNewCustomersMonthly] = useState(5);

    const annualCost = 1164; // $97 * 12

    // Calculations
    const yearlyRevenue = (averageCustomerValue * expectedNewCustomersMonthly) * 12;
    const netProfit = yearlyRevenue - annualCost;
    const roiPercentage = ((netProfit / annualCost) * 100).toFixed(0);

    return (
        <section className="py-24 bg-[#2b2d31] relative overflow-hidden" id="roi-calculator">
            <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Features */}
                    <div className="text-left flex flex-col justify-center">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-12 leading-[1.1]">
                            Why so affordable?
                        </h2>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-start gap-4 group">
                                <CheckCircle2 className="w-6 h-6 text-[#fbe169] shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">AI Automation:</h3>
                                    <p className="text-white/70 text-lg leading-relaxed">
                                        We use proprietary AI to handle the manual coding and content writing that agencies charge thousands for.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <CheckCircle2 className="w-6 h-6 text-[#fbe169] shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Focused niche:</h3>
                                    <p className="text-white/70 text-lg leading-relaxed">
                                        We only work with local contractors, meaning we have the perfect templates ready to go.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <CheckCircle2 className="w-6 h-6 text-[#fbe169] shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">No bloated overhead:</h3>
                                    <p className="text-white/70 text-lg leading-relaxed">
                                        No sales teams or fancy offices—just pure performance tech.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                            <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-[#fbe169]" />
                                Calculate Your Growth Limit
                            </h4>
                            <p className="text-white/60 text-base leading-relaxed">
                                Most agencies will charge you $5,000 for a site that's outdated by the time it launches. Our platform evolves with the AI search landscape to consistently drive massive ROI.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Calculator Card */}
                    <div className="relative">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl relative">
                            <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-[#fbe169] text-brand-dark font-black px-6 py-2 rounded-lg text-sm tracking-widest uppercase shadow-md">
                                GROWTH ENGINE
                            </div>

                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-black text-brand-dark mb-2">Your ROI Projection</h3>
                                <p className="text-brand-dark/50 font-bold text-sm uppercase tracking-wider">
                                    Adjust the sliders to see your potential returns
                                </p>
                            </div>

                            {/* Slider 1: Customer Value */}
                            <div className="mb-8 w-full">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-sm font-bold text-brand-dark uppercase tracking-wide">Average Customer Value</span>
                                    <span className="text-xl font-black text-brand-dark">${averageCustomerValue.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="100"
                                    max="5000"
                                    step="50"
                                    value={averageCustomerValue}
                                    onChange={(e) => setAverageCustomerValue(Number(e.target.value))}
                                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#fbe169]/50"
                                    style={{
                                        background: `linear-gradient(to right, #fbe169 ${(averageCustomerValue - 100) / 49}%, #e5e7eb ${(averageCustomerValue - 100) / 49}%)`
                                    }}
                                />
                            </div>

                            {/* Slider 2: Expected Volume */}
                            <div className="mb-10 w-full">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-sm font-bold text-brand-dark uppercase tracking-wide">Expected New Customers / Mo.</span>
                                    <span className="text-xl font-black text-brand-dark">{expectedNewCustomersMonthly}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    step="1"
                                    value={expectedNewCustomersMonthly}
                                    onChange={(e) => setExpectedNewCustomersMonthly(Number(e.target.value))}
                                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#fbe169]/50"
                                    style={{
                                        background: `linear-gradient(to right, #fbe169 ${(expectedNewCustomersMonthly - 1) * 5.26}%, #e5e7eb ${(expectedNewCustomersMonthly - 1) * 5.26}%)`
                                    }}
                                />
                            </div>

                            {/* Results Area */}
                            <div className="bg-[#fbfcfa] border border-gray-100 p-6 rounded-2xl mb-8">
                                <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                                    <div>
                                        <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Yearly Cost</div>
                                        <div className="text-3xl font-extrabold text-brand-dark">${annualCost.toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Est. Yearly Revenue</div>
                                        <div className="text-3xl font-extrabold text-brand-dark">${yearlyRevenue.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Estimated Net Profit</div>
                                        <div className="text-4xl font-extrabold text-[#10b981]">${netProfit.toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">ROI</div>
                                        <div className="text-4xl font-extrabold text-[#fbe169]">
                                            {roiPercentage}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-brand-dark/70 text-center font-medium leading-relaxed mb-8 text-[15px]">
                                With just <span className="font-extrabold text-brand-dark">{expectedNewCustomersMonthly}</span> new customers a month at <span className="font-extrabold text-brand-dark">${averageCustomerValue}</span> each, this site generates <span className="font-extrabold text-[#10b981]">${netProfit.toLocaleString()}</span> in pure profit every year.
                            </p>

                            <button
                                onClick={() => {
                                    window.open('https://calendar.app.google/QQsVbiAt4QdCX8mx8', '_blank');
                                }}
                                className="w-full py-5 bg-[#fbe169] hover:bg-[#ebd258] text-brand-dark font-black text-xl rounded-full transition-all shadow-[0_4px_14px_0_rgba(251,225,105,0.39)] hover:shadow-[0_6px_20px_rgba(251,225,105,0.23)] hover:-translate-y-1"
                            >
                                Claim Your Growth Engine
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
