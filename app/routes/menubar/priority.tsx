import {PlayListSm} from "~/components/planlist/plan-list-sm";
import React from "react";
import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {getPlansByType} from "~/utils/plan.server";
import {requireUserId} from "~/utils/auth.server";
import type {ItemProps} from "~/components/planlist/item";
import {useLoaderData} from "@remix-run/react";

export const loader: LoaderFunction = async ({request}) => {
    const plans1 = await getPlansByType(await requireUserId(request), 2);
    const planList1: ItemProps[] = plans1.map((plan, index) => {
        return {
            num: index + 1,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            id: plan.id,
            completed: plan.completed
        };
    });

    const plans2 = await getPlansByType(await requireUserId(request), 1);
    const planList2: ItemProps[] = plans2.map((plan, index) => {
        return {
            num: index + 1,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            id: plan.id,
            completed: plan.completed
        };
    });
    const plans3 = await getPlansByType(await requireUserId(request), 3);
    const planList3: ItemProps[] = plans3.map((plan, index) => {
        return {
            num: index + 1,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            id: plan.id,
            completed: plan.completed
        };
    });

    const plans4 = await getPlansByType(await requireUserId(request), 4);
    const planList4: ItemProps[] = plans4.map((plan, index) => {
        return {
            num: index + 1,
            name: plan.name,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: plan.status,
            id: plan.id,
            completed: plan.completed
        };
    });
    return json({plans1: planList1, plans2: planList2, plans3: planList3, plans4: planList4}, {status: 200});
};

export default function PriorityList() {
    const data = useLoaderData();
    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-x-5 gap-y-2 h-full bg-[#CCE8CF]">
            <div className="overflow-y-auto">
                <div className="tooltip flex justify-around">
                    <button className="btn btn-error btn-sm">???????????????</button>
                </div>
                <span
                    className="text-sm text-gray-500 flex justify-around">??????????????????????????????????????????????????????????????????????????????</span>
                <div>
                    <PlayListSm
                        name="parent"
                        items={data.plans1}
                        value={undefined}
                    />
                </div>
            </div>
            <div className="overflow-y-auto">
                <div className="tooltip flex justify-around">
                    <button className="btn btn-warning btn-sm">???????????????</button>
                </div>
                <span
                    className="text-sm text-gray-500 flex justify-around">??????????????????????????????????????????????????????????????????????????????????????????</span>
                <div>
                    <PlayListSm
                        name="parent"
                        items={data.plans2}
                        value={undefined}
                    />
                </div>
            </div>
            <div className="overflow-y-auto">
                <div className="tooltip flex justify-around">
                    <button className="btn btn-info btn-sm">??????????????????</button>
                </div>
                <span
                    className="text-sm text-gray-500 flex justify-around">????????????????????????????????????????????????????????????????????????????????????</span>
                <div>
                    <PlayListSm
                        name="parent"
                        items={data.plans3}
                        value={undefined}
                    />
                </div>
            </div>
            <div className="overflow-y-auto">
                <div className="tooltip flex justify-around">
                    <button className="btn btn-success btn-sm">??????????????????</button>
                </div>
                <span
                    className="text-sm text-gray-500 flex justify-around">?????????????????????????????????????????????????????????????????????</span>
                <div>
                    <PlayListSm
                        name="parent"
                        items={data.plans4}
                        value={undefined}
                    />
                </div>
            </div>
        </div>
    )
}