import React, {useEffect, useState} from "react";
import {AoeRelationItem} from "~/components/aoe/aoe-relation-item";
import {SelectField} from "~/components/form/select-field";
import type {AoeRelationItemProps} from "~/components/aoe/aoe-relation-item";
import type {OptionFieldProps} from "~/components/form/select-field";
import type {AoePlanItemProps} from "~/components/aoe/aoe-plan-item";
import {FormField} from "~/components/form/form-field";

interface AoeRelationListProps {
    aoeRelationItems: AoeRelationItemProps[];
    aoePlanItems: AoePlanItemProps[];
    groupId?: string;
}

export function AoeRelationList({aoeRelationItems, aoePlanItems, groupId = ""}: AoeRelationListProps) {
    const list = aoeRelationItems.map((aoeItem: AoeRelationItemProps) => {
        const parentName = aoePlanItems.find((plan) => plan.id === aoeItem.parentId)?.name;
        const childName = aoePlanItems.find((plan) => plan.id === aoeItem.childId)?.name;
        return (
            <AoeRelationItem
                key={aoeItem.id}
                num={aoeItem.num}
                id={aoeItem.id}
                parent={parentName}
                child={childName}
                day={aoeItem.day}
                hour={aoeItem.hour}
                content={aoeItem.content}
                groupId={aoeItem.groupId}
            />
        );
    });

    const [submit, setSubmit] = useState(false);

    const [parent, setParent] = useState<OptionFieldProps[]>([]);

    const [child, setChild] = useState<OptionFieldProps[]>([]);

    const [formData, setFormData] = useState({
        parentId: "",
        childId: "",
        day: 0,
        hour: 0,
        content: ""
    });

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        if(event.target.name === "parentId") {
            const parents = getParents(aoePlanItems, event.target.value);
            const child_ = getChild(aoePlanItems, event.target.value);
            setChild(aoePlanItems.filter(
                (plan) => !parents.includes(plan) && !child_.includes(plan)
            ).map((plan) => {
                return {
                    value: plan.id,
                    label: plan.name,
                };
            }));
            if(child.filter((item)=> item.value === formData.childId).length === 0)
                setFormData({...formData, [event.target.name]: event.target.value, childId: ""});
            else
                setFormData({...formData, [event.target.name]: event.target.value});
        }
        else if(event.target.name === "childId") {
            const children = getChildren(aoePlanItems, event.target.value);
            const parent_ = getParent(aoePlanItems, event.target.value);
            setParent(aoePlanItems.filter(
                (plan) => !children.includes(plan) && !parent_.includes(plan)
            ).map((plan) => {
                return {
                    value: plan.id,
                    label: plan.name,
                };
            }));
            if(parent.filter((item)=> item.value === formData.parentId).length === 0)
                setFormData({...formData, [event.target.name]: event.target.value, parentId: ""});
            else
                setFormData({...formData, [event.target.name]: event.target.value});
        }
        else if (event.target.name === "day") {
            let value = parseInt(event.target.value);
            if (value < 0) value = 0;
            setFormData({...formData, [event.target.name]: value});
        }
        else if (event.target.name === "hour") {
            let value = parseInt(event.target.value);
            if (value < 0) value = 0;
            if (value > 23) value = 23;
            setFormData({...formData, [event.target.name]: value});
        }
        else {
            setFormData({...formData, [event.target.name]: event.target.value});
        }
    }

    //???????????????
    function getChildren<T>(plans: T[], parentId: string) : T[] {
        let result: T[] = [];
        result.push(plans.find((plan: any) => plan.id === parentId)!!);
        const relationList = aoeRelationItems.filter((relation) => relation.parentId === parentId);
        relationList.forEach((relation) => {
            const child: any = plans.find((plan: any) => plan.id === relation.childId)!!;
            getChildren(plans, child.id).forEach((item) => {
                result.push(item);
            });
        });
        return result;
    }

    //???????????????
    function getParents<T>(plans: T[], childId: string) : T[] {
        let result: T[] = [];
        result.push(plans.find((plan: any) => plan.id === childId)!!);
        const relationList = aoeRelationItems.filter((relation) => relation.childId === childId);
        relationList.forEach((relation) => {
            const parent: any = plans.find((plan: any) => plan.id === relation.parentId)!!;
            getParents(plans, parent.id).forEach((item) => {
                result.push(item);
            });
        });
        return result;
    }

    //???????????????
    function getChild<T>(plans: T[], parentId: string) : T[] {
        let result: T[] = [];
        const relationList = aoeRelationItems.filter((relation) => relation.parentId === parentId);
        relationList.forEach((relation) => {
            const child: any = plans.find((plan: any) => plan.id === relation.childId)!!;
            result.push(child);
        });
        return result;
    }

    //???????????????
    function getParent<T>(plans: T[], childId: string) : T[] {
        let result: T[] = [];
        const relationList = aoeRelationItems.filter((relation) => relation.childId === childId);
        relationList.forEach((relation) => {
            const parent: any = plans.find((plan: any) => plan.id === relation.parentId)!!;
            result.push(parent);
        });
        return result;
    }

    useEffect(() => {
        if (!submit && formData.parentId.length > 0 && formData.childId.length > 0 && formData.content.length > 0)
            setSubmit(true);
        else if (submit && (formData.parentId.length === 0 || formData.childId.length === 0 || formData.content.length === 0))
            setSubmit(false);
    }, [formData, submit])

    useEffect(() => {
        initialSelect();
    }, [aoePlanItems])

    function initialSelect(){
        setParent(aoePlanItems.map((aoeItem) => {
            return {
                value: aoeItem.id,
                label: aoeItem.name,
            }
        }))
        setChild(aoePlanItems.map((aoeItem) => {
            return {
                value: aoeItem.id,
                label: aoeItem.name,
            }
        }))
    }

    return (
        <>
            {groupId !== "" &&
                <table className="table table-compact w-full">
                    <thead>
                    <tr>
                        <th className="text-center">??????</th>
                        <th className="text-center">????????????</th>
                        <th className="text-center">????????????</th>
                        <th className="text-center">????????????</th>
                        <th className="text-center">????????????</th>
                        <th className="text-center">
                            <label htmlFor="my-modal-1" className="btn btn-sm btn-primary w-24">??????</label>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {list}
                    </tbody>
                </table>
            }
            {groupId === "" &&
                <div className="h-full text-center grid justify-around" style={{display: "flex", alignItems: "center"}}>
                    <h1 className="text-4xl font-bold">
                        <span>??????????????????</span>
                    </h1>
                </div>
            }
            <input type="checkbox" id="my-modal-1" className="modal-toggle"/>
            <div className="modal">
                <div className="modal-box max-w-4xl">
                    <h3 className="font-bold text-lg">????????????</h3>
                    <form action="aoe/relationDao" method="post" className="w-full">
                        <input name="groupId" defaultValue={groupId} className="hidden"/>
                        <table className="table w-full">
                            <tr>
                                <td>
                                    <SelectField
                                        htmlFor="parentId"
                                        label="????????????"
                                        value={formData.parentId}
                                        args={parent}
                                        onChange={handleChange}
                                        tips="?????????????????????"
                                        horizontal={false}
                                    />
                                </td>
                                <td rowSpan={4}>
                                    <FormField
                                        htmlFor="content"
                                        label="????????????"
                                        className="textarea h-56 input-bordered col-span-2"
                                        value={formData.content}
                                        onChange={handleChange}
                                        textarea={true}
                                        horizontal={false}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <SelectField
                                        htmlFor="childId"
                                        label="????????????"
                                        value={formData.childId}
                                        args={child}
                                        onChange={handleChange}
                                        tips="?????????????????????"
                                        horizontal={false}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <FormField
                                        htmlFor="day"
                                        label="??????"
                                        type="number"
                                        value={formData.day}
                                        onChange={handleChange}
                                        horizontal={false}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <FormField
                                        htmlFor="hour"
                                        label="??????"
                                        type="number"
                                        value={formData.hour}
                                        onChange={handleChange}
                                        horizontal={false}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="flex justify-end gap-5">
                                        <label htmlFor="my-modal-1" className="btn btn-primary w-24" onClick={
                                            () => {
                                                setFormData({
                                                    parentId: "",
                                                    childId: "",
                                                    day: 0,
                                                    hour: 0,
                                                    content: ""
                                                })
                                                initialSelect();
                                            }
                                        }>??????</label>
                                        <button name="_action" value="create" type="submit"
                                                className="btn btn-primary w-24" disabled={!submit}>??????
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
            </div>
        </>
    );
}