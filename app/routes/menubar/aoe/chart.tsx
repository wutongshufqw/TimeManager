import {Echarts} from "~/components/planlist/echarts";
import type {EChartsOption} from "echarts";
import type {AoeRelationItemProps} from "~/components/aoe/aoe-relation-item";
import type {AoePlanItemProps} from "~/components/aoe/aoe-plan-item";
import {useEffect, useState} from "react";

interface ChartProps {
    loaderData: any;
    actionData: any;
}

interface Point {
    id: string;
    name: string;
    depth: number;
}

interface Graph {
    points: Point[],
    depth: number,
    number: number[],
}

interface GPoint {
    name: string;
    x: number;
    y: number;
}

interface GGraph {
    source: string | number;
    target: string | number;
    value?: number;
    label?: {
        show: boolean,
        formatter: string,
        fontSize: number
    }
}

class Queue<T> {
    private data: Array<T> = new Array<T>();
    push = (item: T) => this.data.push(item);
    pop = (): T | undefined => this.data.shift();
}


export default function Chart({loaderData, actionData}: ChartProps) {
    const aoePlanList = actionData?.aoePlanList ? actionData.aoePlanList : loaderData.aoePlanList;
    const aoeRelationList = actionData?.aoeRelationList ? actionData.aoeRelationList : loaderData.aoeRelationList;

    const [points, setPoints] = useState(()=>{
        const init: GPoint[] = [];
        return init;
    })

    const [graph, setGraph] = useState(()=>{
        const init: GGraph[] =[];
        return init;
    })

    //初始化节点
    function getGraph() {
        function getHead(aoePlanItem: AoePlanItemProps): AoePlanItemProps {
            const temp = aoeRelationList.filter((item: AoeRelationItemProps) => item.childId === aoePlanItem.id);
            if (temp.length !== 0)
                return getHead(aoePlanList.filter((item: AoePlanItemProps) => item.id = temp[0].parentId))
            return aoePlanItem;
        }

        const q = new Queue<Point>();
        const graph: Graph = {points: [], depth: 0, number: []};
        let head = getHead(aoePlanList[0]);
        q.push({id: head.id, name: head.name, depth: 0})
        let temp: Point | undefined;
        while ((temp = q.pop()) !== undefined) {
            graph.points.push(temp);//节点入图
            graph.depth = temp.depth;
            const list = aoeRelationList.filter((item: AoeRelationItemProps) => item.parentId === temp!!.id)//子节点关系
            list.forEach((item: AoeRelationItemProps) => {
                const plan = aoePlanList.filter((i: AoePlanItemProps) => i.id === item.childId)[0]//子节点
                q.push({id: plan.id, name: plan.name, depth: temp!!.depth + 1})
            })
        }

        //去重
        let tempPoints: Point[] = [];
        for (let i = graph.points.length - 1; i >= 0; i--)
            if (tempPoints.filter((point) => point.id === graph.points[i].id).length === 0)
                tempPoints.push(graph.points[i]);
        graph.points = []
        while ((temp = tempPoints.pop()) !== undefined) {
            graph.points.push(temp)
            if (!graph.number[temp.depth])
                graph.number.push(1);
            else
                graph.number[temp.depth]++;
        }
        return graph;
    }

    useEffect(() => {
        if (aoePlanList[0] && aoeRelationList[0]) {
            const graph: Graph = getGraph();
            let depth = 0;
            let x = 0;
            let max=0;
            graph.number.forEach((num)=>max = Math.max(num, max));
            let axis_y: number[] = [];
            let flag: boolean[] = [];
            for(let i = 0; i < max; i++){
                axis_y.push((2*i+1)*150);
                flag.push(false);
            }
            let g_points: GPoint[] = [];
            graph.points.forEach((point)=>{
                if(point.depth !== depth){
                    depth=point.depth
                    x+=300;
                    for(let i = 0; i < max; i++)
                        flag[i]=false;
                }
                let axis;
                do{
                    axis = Math.ceil(Math.random()*max)
                }while(flag[axis])
                flag[axis]=true;
                g_points.push({name:point.name,x,y:axis_y[axis]});
            })
            setPoints(g_points);
            let g_graph: GGraph[] = [];
            aoeRelationList.forEach((item: AoeRelationItemProps)=>{
                const parent: AoePlanItemProps = aoePlanList.filter((i: AoePlanItemProps) => i.id === item.parentId)[0]
                const child: AoePlanItemProps = aoePlanList.filter((i: AoePlanItemProps) => i.id === item.childId)[0]
                g_graph.push({
                    source: parent.name,
                    target: child.name,
                    value: item.day*24+item.hour,
                    label: {
                        show: true,
                        formatter: item.day+"天"+item.hour+"时",
                        fontSize: 10
                    }
                })
            });
            setGraph(g_graph);
        }
    },[aoePlanList, aoeRelationList])

    const option: EChartsOption = {
        title: {
            text: 'AOE 图'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'none',
                symbolSize: 50,
                roam: true,
                label: {
                    show: true
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    fontSize: 20
                },
                data: points,
                // links: [],
                links: graph,
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                }
            }
        ]
    }
    return (
        <>
            <div className="container w-full h-full">
                <Echarts option={option}/>
            </div>
        </>
    )
}